/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-classifier-datasource-provider-datasource-mongo';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const ramda = require('@ibm-aca/aca-wrapper-ramda');
const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { formatIntoAcaError, appendDataToError, throwAcaError, ACA_ERROR_TYPE } = require('@ibm-aca/aca-utils-errors');

const { AcaClassifierDatasource } = require('../datasource');
const { getAcaMongoClient } = require('@ibm-aiap/aiap-mongo-client-provider');
const { createIndex } = require('@ibm-aiap/aiap-utils-mongo')

const _classifier = require('./classifier-models');
const _classifierModelsChanges = require('./classifier-models-changes');
const { sanitizedCollectionsFromConfiguration } = require('./collections.utils');

class AcaClassifierDatasourceMongo extends AcaClassifierDatasource {

  constructor(configuration) {
    try {
      super(configuration);

      this._collections = sanitizedCollectionsFromConfiguration(this.configuration);

      const ACA_MONGO_CLIENT_ID = this.configuration?.client;
      const ACA_MONGO_CLIENT_HASH = this.configuration?.clientHash;

      this.mongoClientName = this.configuration?.client;
      this.acaMongoClient = getAcaMongoClient(ACA_MONGO_CLIENT_ID, ACA_MONGO_CLIENT_HASH);
    } catch (error) {
      const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
      appendDataToError(ACA_ERROR, { configuration })
      logger.error('constructor', { ACA_ERROR });
      throw ACA_ERROR;
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
        const ACA_MONGO_CLIENT_ID = this.configuration?.client; 
        const ACA_MONGO_CLIENT_HASH = this.configuration?.clientHash;

        this.acaMongoClient = getAcaMongoClient(ACA_MONGO_CLIENT_ID, ACA_MONGO_CLIENT_HASH);
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

  async initialize() {
    await this._ensureIndexes();
  }

  async _ensureIndexes() {
    try {
      const DB = await this._getDB();
      const COLLECTIONS = this._collections;
      await createIndex(DB, COLLECTIONS.models, { modelId: 1 });
    } catch (error) {
      const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
      ACA_ERROR.configuration = this.configuration;
      logger.error(this._ensureIndexes.name, { ACA_ERROR });
      throw ACA_ERROR;
    }
  }

  get classifier() {
    const RET_VAL = {
      findManyByQuery: async (context, params) => {
        return _classifier.findManyByQuery(this, context, params);
      },
      findOneById: async (context, params) => {
        return _classifier.findOneById(this, context, params);
      },
      saveOne: async (context, params) => {
        return _classifier.saveOne(this, context, params);
      },
      deleteManyByIds: async (context, params) => {
        return _classifier.deleteManyByIds(this, context, params);
      },
    };
    return RET_VAL;
  }

  get classifierModelsChanges() {
    const RET_VAL = {
      findManyByQuery: async (context, params) => {
        return _classifierModelsChanges.findManyByQuery(this, context, params);
      },
      findOneById: async (context, params) => {
        return _classifierModelsChanges.findOneById(this, context, params);
      },
      saveOne: async (context, params) => {
        return _classifierModelsChanges.saveOne(this, context, params);
      },
    };
    return RET_VAL;
  }

}


module.exports = {
  AcaClassifierDatasourceMongo
};
