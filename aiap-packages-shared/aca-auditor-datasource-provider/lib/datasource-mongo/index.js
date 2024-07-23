/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-auditor-datasource-mongo'
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { formatIntoAcaError, appendDataToError, ACA_ERROR_TYPE, throwAcaError } = require('@ibm-aca/aca-utils-errors');

const { getAcaMongoClient } = require('@ibm-aiap/aiap-mongo-client-provider');

const { AcaAuditorDatasource } = require('../datasource');

const { sanitizedCollectionsFromConfiguration } = require('./collections.utils');

const _purchaseRequests = require('./purchase-requests');
const _rules = require('./rules');
const _rulesMessages = require('./rules-messages');
const _organizations = require('./organizations');
const _lambdaModules = require('./lambda-modules');
const _lambdaModulesErrors = require('./lambda-modules-errors');

class AcaAuditorDatasourceMongo extends AcaAuditorDatasource {

  constructor(configuration) {
    super(configuration);
    try {
      this._collections = sanitizedCollectionsFromConfiguration(this.configuration);
      const ACA_MONGO_CLIENT_ID = this.configuration?.client;
      const ACA_MONGO_CLIENT_HASH = this.configuration?.clientHash;
      this.acaMongoClient = getAcaMongoClient(ACA_MONGO_CLIENT_ID, ACA_MONGO_CLIENT_HASH);
      logger.info('INITIALIZED');
    } catch (error) {
      const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
      appendDataToError(ACA_ERROR, { configuration })
      logger.error('constructor', { ACA_ERROR });
    }
  }

  async _getClient() {
    const RET_VAL = await this.acaMongoClient.getClient();
    return RET_VAL;
  }

  async _getDB() {
    const RET_VAL = await this.acaMongoClient.getDB();
    return RET_VAL;
  }

  async _getAcaMongoClient() {
    let retVal;
    try {
      retVal = this.acaMongoClient;
      if (
        lodash.isEmpty(retVal)
      ) {
        this.acaMongoClient = getAcaMongoClient(this.mongoClientName);
        retVal = this.acaMongoClient;
      }
      if (
        lodash.isEmpty(retVal)
      ) {
        const MESSAGE = `Unable to retrieve AcaMongoClient!`;
        throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, MESSAGE);
      }
      return retVal;
    } catch (error) {
      const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
      logger.error('_getAcaMongoClient', { ACA_ERROR });
      throw ACA_ERROR;
    }
  }

  async initialize() { }

  get lambdaModules() {
    return {
      findManyByQuery: async (context, params) => {
        return _lambdaModules.findManyByQuery(this, context, params);
      },
      //
      deleteOneById: async (context, params) => {
        return _lambdaModules.deleteOneById(this, context, params);
      },
      findOneById: async (context, params) => {
        return _lambdaModules.findOneById(this, context, params);
      },
      saveOne: async (context, params) => {
        return _lambdaModules.saveOne(this, context, params);
      },
    };
  }

  get lambdaModulesErrors() {
    return {
      findManyByQuery: async (context, params) => {
        return _lambdaModulesErrors.findManyByQuery(this, context, params);
      },
      //
      deleteOneById: async (context, params) => {
        return _lambdaModulesErrors.deleteOneById(this, context, params);
      },
      findOneById: async (context, params) => {
        return _lambdaModulesErrors.findOneById(this, context, params);
      },
      saveOne: async (context, params) => {
        return _lambdaModulesErrors.saveOne(this, context, params);
      },
    };
  }

  get rulesMessages() {
    return {
      findManyByQuery: async (context, params) => {
        return _rulesMessages.findManyByQuery(this, context, params);
      },
      findOneById: async (context, params) => {
        return _rulesMessages.findOneById(this, context, params);
      },
      saveOne: async (context, params) => {
        return _rulesMessages.saveOne(this, context, params);
      },
      deleteOneById: async (context, params) => {
        return _rulesMessages.deleteOneById(this, context, params);
      },
    };
  }

  get organizations() {
    return {
      findManyByQuery: async (context, params) => {
        return _organizations.findManyByQuery(this, context, params);
      },
      findOneById: async (context, params) => {
        return _organizations.findOneById(this, context, params);
      },
      saveOne: async (context, params) => {
        return _organizations.saveOne(this, context, params);
      },
      deleteOneById: async (context, params) => {
        return _organizations.deleteOneById(this, context, params);
      },
    };
  }

  get purchaseRequests() {
    return {
      findManyByQuery: async (context, params) => {
        return _purchaseRequests.findManyByQuery(this, context, params);
      },
      findOneById: async (context, params) => {
        return _purchaseRequests.findOneById(this, context, params);
      },
      saveOne: async (context, params) => {
        return _purchaseRequests.saveOne(this, context, params);
      },
      deleteOneById: async (context, params) => {
        return _purchaseRequests.deleteOneById(this, context, params);
      },
    };
  }

  get rules() {
    return {
      findManyByQuery: async (context, params) => {
        return _rules.findManyByQuery(this, context, params);
      },
      findOneById: async (context, params) => {
        return _rules.findOneById(this, context, params);
      },
      saveOne: async (context, params) => {
        return _rules.saveOne(this, context, params);
      },
      deleteOneById: async (context, params) => {
        return _rules.deleteOneById(this, context, params);
      },
    };
  }

}

module.exports = {
  AcaAuditorDatasourceMongo,
};
