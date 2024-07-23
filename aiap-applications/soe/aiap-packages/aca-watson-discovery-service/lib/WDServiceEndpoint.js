/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-watson-discovery-service';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const { ExponentialBackoff } = require('@ibm-aiap/aiap-utils-common');

const {
  BasicAuthenticator,
  IamAuthenticator,
  DiscoveryV1,
} = require('@ibm-aiap/aiap-wrapper-ibm-watson');

class WDServiceEndpoint {
  constructor(config, mainConfig) {
    this.config = config;
    this.mainConfig = mainConfig;

    this.environments = [];

    if (this.config.authorizationType === 'iam') {
      this.discovery = new DiscoveryV1({
        authenticator: new IamAuthenticator({
          apikey: this.config.iamApiKey,
          url: this.config.iamUrl,
        }),
        url: this.config.url,
        version: this.config.versionDate,
      });
    } else {
      this.discovery = new DiscoveryV1({
        authenticator: new BasicAuthenticator({
          username: this.config.username,
          password: this.config.password,
        }),
        url: this.config.url,
        version: this.config.versionDate,
      });
    }
  }

  getEnvironments() {
    return new Promise((resolve, reject) => {
      this.discovery
        .listEnvironments()
        .then(response => {
          resolve(response['result']['environments']);
        })
        .catch(err => {
          reject(err);
        });
    });
  }

  getCollections(environmentId) {
    return new Promise((resolve, reject) => {
      this.discovery
        .listCollections({ environmentId: environmentId })
        .then(response => {
          resolve(response['result']['collections']);
        })
        .catch(err => {
          reject(err);
        });
    });
  }

  loadCollectionsWithRetry(environment) {
    const MAX_RETRIES = this.mainConfig.maxRetries;
    const BACKOFF_DELAY = this.mainConfig.backoffDelay;
    const expBackoff = new ExponentialBackoff(MAX_RETRIES, BACKOFF_DELAY);

    const callWDS = attempt => {
      logger.debug('[WDS] request', {
        attempt,
      });
      return this.getCollections(environment.environment_id)
        .then(response => {
          logger.debug('Retrieved collections', { serviceId: this.config.id, collections: response });
          environment.collections = response;
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

  loadEnvironmentsWithRetry() {
    const MAX_RETRIES = this.mainConfig.maxRetries;
    const BACKOFF_DELAY = this.mainConfig.backoffDelay;
    const expBackoff = new ExponentialBackoff(MAX_RETRIES, BACKOFF_DELAY);

    const callWDS = attempt => {
      logger.debug('[WDS] request', {
        attempt,
      });
      return this.getEnvironments()
        .then(response => {
          logger.debug('Retrieved environments', { serviceId: this.config.id, environments: response });
          this.environments = response.map(e => {
            e.collections = [];
            return e;
          });
          this.environments.forEach(e => this.loadCollectionsWithRetry(e));
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

  getEnvironmentById(environmentId) {
    return this.environments.find(e => e.environment_id === environmentId);
  }

  getEnvironmentIdDefault() {
    const environment = this.environments[0];
    if (environment === undefined) throw new Error(`No environment defined`);
    return environment.environment_id;
  }

  getCollectionIdByName(environmentId, collectionName) {
    const environment = this.getEnvironmentById(environmentId);
    if (!environment) throw new Error(`No environment found by id: ${environmentId}`);

    if (!collectionName) collectionName = this.config.collectionName;

    const collections = environment.collections.filter(c => {
      return c.name === collectionName;
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
