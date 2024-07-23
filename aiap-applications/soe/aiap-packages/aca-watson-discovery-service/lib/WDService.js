/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const logger = require('@ibm-aca/aca-common-logger')('watson-discovery-service');
const { ExponentialBackoff } = require('@ibm-aiap/aiap-utils-common');
const WDServiceEndpoint = require('./WDServiceEndpoint');
const R = require('ramda');

class WDService {
  constructor(config) {
    this.config = config;
    this.endpoints = [];

    const servicesConfigurations = R.path(['services'], this.config);
    if (Array.isArray(servicesConfigurations)) {
      servicesConfigurations.forEach(serviceConfiguration => {
        let serviceEndpoint = WDServiceEndpoint(serviceConfiguration, this.config);
        this.endpoints.push(serviceEndpoint);
      });
    }
    this.__startPolling();
  }

  /**
   * Set polling workspaces for each endpoint
   */
  __startPolling() {
    //Set polling for service collections
    this.endpoints.forEach(element => {
      element.loadEnvironmentsWithRetry();
      setInterval(() => element.loadEnvironmentsWithRetry(), this.config.poller.interval);
    });
  }

  query(message, serviceId, environmentId, collectionName, limit) {
    return new Promise((resolve, reject) => {
      const service = this.__getEndpointByID(serviceId);
      if (!service) {
        reject(`Could not find required WDS endpoint by id ${serviceId}`);
        return;
      }
      const eId = environmentId ? environmentId : service.config.environmentId;
      let cId;
      try {
        cId = service.getCollectionIdByName(eId, collectionName);
      } catch (err) {
        reject(err.message);
        return;
      }
      this.__wdsClientWithRetry(message, service, eId, cId, limit ? limit : service.mainConfig.resultsLimit)
        .then(result => {
          resolve(result);
        })
        .catch(err => reject(err));
    });
  }

  __queryCollection(message, service, environmentId, collectionId, limit) {
    return new Promise((resolve, reject) => {
      service.discovery.query(
        {
          environmentId: environmentId,
          collectionId: collectionId,
          query: message,
          count: limit,
        },
        (err, result) => {
          if (err) {
            logger.error(`Error processing Discovery query`, err);
            reject(this.config.unavailableMessage);
          } else {
            resolve(result);
          }
        }
      );
    });
  }

  __wdsClientWithRetry(message, service, environmentId, collectionId, limit) {
    const expBackoff = new ExponentialBackoff(this.config.maxRetries, this.config.backoffDelay);
    const log = (level, id, attempt, msg, meta) =>
      logger[level](msg, R.mergeRight({ message, config: service.config, environmentId, collectionId, limit }, meta));
    const debug = R.curry(log)('debug');
    const error = R.curry(log)('error');

    const callWDS = attempt => {
      debug(1, attempt, '[WDS] request', {
        params: { message, service: service.config, environmentId, collectionId, limit },
        config: this.config,
      });
      return this.__queryCollection(message, service, environmentId, collectionId, limit)
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

  /**
   * Get endpoint by Id or default if no requested id provided
   * @param endpointId
   * @returns {*}
   */
  __getEndpointByID(endpointId) {
    return this.endpoints.find(element => {
      return endpointId == null ? element.config.defaultEndpoint : element.config.id === endpointId;
    });
  }
}

module.exports = config => new WDService(config);
