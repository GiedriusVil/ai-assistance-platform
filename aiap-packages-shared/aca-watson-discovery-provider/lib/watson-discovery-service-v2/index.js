/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-watson-discovery-provider-watson-discovery-service-v2';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { createAcaError, ACA_ERROR_TYPE, throwAcaError, formatIntoAcaError } = require('@ibm-aca/aca-utils-errors');

const {
  BasicAuthenticator,
  IamAuthenticator,
  DiscoveryV2,
} = require('@ibm-aiap/aiap-wrapper-ibm-watson');

const _projects = require('./projects');
const _collections = require('./collections');
const _documents = require('./documents');

const { AcaWatsonDiscoveryService } = require('../watson-discovery-service');

class AcaWatsonDiscoveryServiceV2 extends AcaWatsonDiscoveryService {

  constructor(config) {
    super();
    this._init(config);
  }

  _init(config) {
    try {
      this.config = config;
      this.version = this.config?.version;
      this.url = this.config?.url;
      this.authType = this.config?.authType;
      this.username = this.config?.username;
      this.password = this.config?.password;
      const ERRORS = this._isConfigurationValid();
      if (
        !lodash.isEmpty(ERRORS)
      ) {
        const MESSAGE = `Multiple errors identified!`;
        throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, MESSAGE, { ERRORS });
      }
      if (
        this.authType === 'IAM' &&
        this.username === 'apikey'
      ) {
        this.authenticator = new IamAuthenticator({
          apikey: this.password
        });
      } else {
        this.authenticator = new BasicAuthenticator({
          username: this.username,
          password: this.password,
        });
      }
      this.headers = {
        'X-Watson-Learning-Opt-Out': 'true'
      };
      const DISCOVERY_SERVICE_OPTIONS = {
        version: this.version,
        serviceUrl: this.url,
        authenticator: this.authenticator,
        headers: this.headers
      };
      this.discoveryService = new DiscoveryV2(DISCOVERY_SERVICE_OPTIONS);
      logger.info('INITIALIZED', { DISCOVERY_SERVICE_OPTIONS });

    } catch (error) {
      const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
      logger.error('_init', { ACA_ERROR });
      throw ACA_ERROR;
    }
  }

  _isConfigurationValid() {
    const ERRORS = [];
    if (
      lodash.isEmpty(this.config)
    ) {
      const MESSAGE = `Missing mandatory config parameter!`;
      const ACA_ERROR = createAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
      ERRORS.push(ACA_ERROR);
    }
    if (
      lodash.isEmpty(this.version)
    ) {
      const MESSAGE = `Missing mandatory config.version parameter!`;
      const ACA_ERROR = createAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
      ERRORS.push(ACA_ERROR);
    }
    if (
      lodash.isEmpty(this.authType)
    ) {
      const MESSAGE = `Missing mandatory config.authType parameter!`;
      const ACA_ERROR = createAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
      ERRORS.push(ACA_ERROR);
    }
    if (
      lodash.isEmpty(this.url)
    ) {
      const MESSAGE = `Missing mandatory config.url parameter!`;
      const ACA_ERROR = createAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
      ERRORS.push(ACA_ERROR);
    }
    if (
      lodash.isEmpty(this.username)
    ) {
      const MESSAGE = `Missing mandatory config.username parameter!`;
      const ACA_ERROR = createAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
      ERRORS.push(ACA_ERROR);
    }
    if (
      lodash.isEmpty(this.password)
    ) {
      const MESSAGE = `Missing mandatory config.password parameter!`;
      const ACA_ERROR = createAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
      ERRORS.push(ACA_ERROR);
    }
    return ERRORS;
  }

  get projects() {
    return {
      createOne: async (context, params) => {
        return _projects.createOne(this.discoveryService, context, params);
      },
      findMany: async (context, params) => {
        return _projects.findMany(this.discoveryService, context, params);
      },
      deleteOne: async (context, params) => {
        return _projects.deleteOne(this.discoveryService, context, params);
      },
      updateOne: async (context, params) => {
        return _projects.updateOne(this.discoveryService, context, params);
      }
    };
  }

  get collections() {
    return {
      createOne: async (context, params) => {
        return _collections.createOne(this.discoveryService, context, params);
      },
      findMany: async (context, params) => {
        return _collections.findMany(this.discoveryService, context, params);
      },
      findOne: async (context, params) => {
        return _collections.findOne(this.discoveryService, context, params);
      },
      deleteOne: async (context, params) => {
        return _collections.deleteOne(this.discoveryService, context, params);
      },
      updateOne: async (context, params) => {
        return _collections.updateOne(this.discoveryService, context, params);
      },
      queryMany: async (context, params) => {
        return _collections.queryMany(this.discoveryService, context, params);
      },
    };
  }

  get documents() {
    return {
      findMany: async (context, params) => {
        return _documents.findMany(this.discoveryService, context, params);
      },
      deleteOne: async (context, params) => {
        return _documents.deleteOne(this.discoveryService, context, params);
      }
    };
  }

}

module.exports = {
  AcaWatsonDiscoveryServiceV2,
};
