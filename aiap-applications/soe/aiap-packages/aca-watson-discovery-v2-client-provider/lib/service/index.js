/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-watson-discovery-v2-client-provider-WD-v2-service';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const ramda = require('@ibm-aca/aca-wrapper-ramda');
const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { throwAcaError, ACA_ERROR_TYPE, formatIntoAcaError } = require('@ibm-aca/aca-utils-errors');

const { ExponentialBackoff } = require('@ibm-aiap/aiap-utils-common');
const WDServiceEndpoint = require('../endpoints/WDService-endpoint');
const { transform, filterParamsTransform, searchFilter } = require('../endpoints/transform.js');

class WDV2Service {
  constructor(config) {
    this.config = config;
    this.endpoints = [];
  }

  async init() {
    const SERVICES_CONFIGURATION = ramda.path(['service'], this.config);
    if (Array.isArray(SERVICES_CONFIGURATION)) {
      SERVICES_CONFIGURATION.forEach(serviceConfiguration => {
        let serviceEndpoint = WDServiceEndpoint(serviceConfiguration, this.config);
        this.endpoints.push(serviceEndpoint);
      });
    }
    this.__startPolling();
  }
  /**
   * Set polling workspaces for each endpoint
   */
  async __startPolling() {
    this.endpoints.forEach(element => {
      element.loadProjectsWithRetry();
      setInterval(() => element.loadProjectsWithRetry(), this.config.poller.interval);
    });
  }

  async query(message, serviceId, projectId, collectionName, limit, filterType, filter) {
    let filterParams = [];
    const SERVICE = this.__getEndpointByID(serviceId);
    if (!SERVICE) {
      const MESSAGE = `Could not find required WDS endpoint by id ${serviceId}`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, MESSAGE);
      return;
    }
    if (!lodash.isEmpty(filterType) && !lodash.isEmpty(filter)) {
      filterParams = filterParamsTransform(filterType, filter);
    }
    const PROJECT_ID = projectId ? projectId : SERVICE.config.projectId;
    let collectionId;
    try {
      try {
        collectionId = SERVICE.getCollectionIdByName(PROJECT_ID, collectionName);
      } catch (err) {
        const ACA_ERROR = formatIntoAcaError(MODULE_ID, err);
        throw ACA_ERROR;
      }
      const RESULT = await this.__wdsClientWithRetry(message, SERVICE, PROJECT_ID, collectionId, limit ? limit : SERVICE.mainConfig.resultsLimit, filterParams);
      return RESULT
    } catch (err) {
      const ACA_ERROR = formatIntoAcaError(MODULE_ID, err);
      logger.error(`query`, { ACA_ERROR });
      throw ACA_ERROR;
    }
  }

  __queryProject(message, service, projectId, collectionId, limit, filterParams) {
    return new Promise((resolve, reject) => {
      let collection = [collectionId];
      const FILTER_STRING = searchFilter(filterParams);
      service.discovery.query({
        projectId: projectId,
        collectionIds: collection,
        query: message,
        count: limit,
        filter: FILTER_STRING,
      }).then(resp => {
        const RET_VAL = transform(resp.result.results);
        resolve(RET_VAL);
      }).catch(err => {
        logger.error(`Error processing Discovery query`, err);
        reject(this.config.unavailableMessage);
      })
    });
  }

  __wdsClientWithRetry(message, service, projectId, collectionId, limit, filterParams) {

    const expBackoff = new ExponentialBackoff(this.config.maxRetries, this.config.backoffDelay);
    const log = (level, id, attempt, msg, meta) =>
      logger[level](msg, ramda.mergeRight({ message, config: service.config, projectId, collectionId, limit }, meta));
    const debug = ramda.curry(log)('debug');
    const error = ramda.curry(log)('error');

    const callWDS = attempt => {
      debug(1, attempt, '[WDS] request', {
        params: { message, service: service.config, projectId, collectionId, limit },
        config: this.config,
      });
      return this.__queryProject(message, service, projectId, collectionId, limit, filterParams)
        .then(wdsResponse => {
          debug(2, attempt, '[WDS] response', { wdsResponse, config: this.config });
          return wdsResponse;
        })
        .catch(err => {
          error(3, attempt, '[WDS] Retrying on error', { err });
          throw err;
        });
    };

    return expBackoff
      .backoff(this.config.maxRetries, callWDS, expBackoff.exponentialBackoff(1, this.config.backoffDelay))
      .catch(err => {
        error(4, this.config.maxRetries, '[WDS] Max error attempts reached', {
          err,
        });
        throw err;
      });
  }

  // /**
  //  * Get endpoint by Id or default if no requested id provided
  //  * @param endpointId
  //  * @returns {*}
  //  */
  __getEndpointByID(endpointId) {
    return this.endpoints.find(element => {
      return endpointId == null ? element.config.defaultEndpoint : element.config.id === endpointId;
    });
  }
}

module.exports = {
  WDV2Service
}
