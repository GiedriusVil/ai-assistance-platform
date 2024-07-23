/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-watson-discovery-v2-client-provider-WD-service-endpoint';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const { ExponentialBackoff } = require('@ibm-aiap/aiap-utils-common');

const {
  IamAuthenticator,
  DiscoveryV2,
} = require('@ibm-aiap/aiap-wrapper-ibm-watson');

class WDServiceEndpoint {
  constructor(config, mainConfig) {
    this.config = config;
    this.mainConfig = mainConfig;
    this.projects = [];
    if (this.config.authorizationType === 'iam') {

      this.discovery = new DiscoveryV2({
        version: this.config.versionDate,
        authenticator: new IamAuthenticator({ apikey: this.config.iamApiKey }),
        serviceUrl: this.config.serviceUrl
      });
    }
  }

  getProjects() {
    return new Promise((resolve, reject) => {
      this.discovery
        .listProjects()
        .then(response => {
          resolve(response['result']['projects']);
        })
        .catch(err => {
          reject(err);
        });
    });
  }

  getCollections(projectId) {
    return new Promise((resolve, reject) => {
      this.discovery
        .listCollections({ projectId: projectId })
        .then(response => {
          resolve(response['result']['collections']);
        })
        .catch(err => {
          reject(err);
        });
    });
  }

  loadCollectionsWithRetry(project) {
    const MAX_RETRIES = this.mainConfig.maxRetries;
    const BACKOFF_DELAY = this.mainConfig.backoffDelay;
    const expBackoff = new ExponentialBackoff(MAX_RETRIES, BACKOFF_DELAY);

    const callWDS = attempt => {
      logger.debug('[WDS] request', {
        attempt,
      });

      return this.getCollections(project.project_id)
        .then(response => {
          logger.debug('Retrieved collections', { serviceId: this.config.id, collections: response });
          project.collections = response;
        })
        .catch(err => {
          logger.error('[WDS] Retrying on error', { attempt, err });
          throw err;
        });
    };

    expBackoff.backoff(MAX_RETRIES, callWDS, expBackoff.exponentialBackoff(1, BACKOFF_DELAY)).catch(err => {
      logger.error('[WDS] Max error attempts reached', {
        MAX_RETRIES,
        err,
      });
      logger.error('Unable to retrieve collections list', { serviceId: this.config.id, error: err });
    });
  }

  loadProjectsWithRetry() {
    const MAX_RETRIES = this.mainConfig.maxRetries;
    const BACKOFF_DELAY = this.mainConfig.backoffDelay;
    const expBackoff = new ExponentialBackoff(MAX_RETRIES, BACKOFF_DELAY);

    const callWDS = attempt => {
      logger.debug('[WDS] request', {
        attempt,
      });
      return this.getProjects()
        .then(response => {
          logger.debug('Retrieved environments', { serviceId: this.config.id, Projects: response });
          this.projects = response.map(project => {
            project.collections = [];
            return project;
          });
          this.projects.forEach(e => this.loadCollectionsWithRetry(e));
        })
        .catch(err => {
          logger.error('[WDS] Retrying on error', { attempt, err });
          throw err;
        });
    };

    expBackoff.backoff(MAX_RETRIES, callWDS, expBackoff.exponentialBackoff(1, BACKOFF_DELAY)).catch(err => {
      logger.error('[WDS] Max error attempts reached', {
        MAX_RETRIES,
        err,
      });
      logger.error('Unable to retrieve environments list', { serviceId: this.config.id, error: err });
    });
  }

  getProjectById(projectId) {
    return this.projects.find(e => e.project_id === projectId);
  }

  getProjectIdDefault() {
    const project = this.projects[0];
    if (project === undefined) throw new Error(`No project defined`);
    return project.project_id;
  }

  getCollectionIdByName(projectId, collectionName) {
    const project = this.getProjectById(projectId);
    if (!project) throw new Error(`No project found by id: ${projectId}`);

    if (!collectionName) collectionName = this.config.collectionName;

    const collections = project.collections.filter(project => {
      return project.name === collectionName;
    });

    if (collections.length > 1) {
      throw new Error(`Multiple collections with same name: ${collectionName}`);
    }

    if (collections.length === 0) {
      throw new Error(`No collections with name: ${collectionName}`);
    }
    return collections[0].collection_id;
  }
}

module.exports = (config, mainConfig, isDefault) => new WDServiceEndpoint(config, mainConfig, isDefault);
