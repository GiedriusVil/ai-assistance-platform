/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-validation-engagements-datasource-mongo';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { formatIntoAcaError, throwAcaError, ACA_ERROR_TYPE } = require('@ibm-aca/aca-utils-errors');

const { getAcaMongoClient } = require('@ibm-aiap/aiap-mongo-client-provider');
const { createIndex } = require('@ibm-aiap/aiap-utils-mongo')

const { AcaValidationEngagementsDatasource } = require('../datasource');
const { sanitizedCollectionsFromConfiguration } = require('./collections.utils');

const _validationEngagements = require('./validation-engagements');
const _validationEngagementsChanges = require('./validation-engagements-changes');

class AcaValidationEngagementsDatasourceMongo extends AcaValidationEngagementsDatasource {

  constructor(configuration) {
    try {
      super(configuration);
      this._collections = sanitizedCollectionsFromConfiguration(this.configuration);
      const ACA_MONGO_CLIENT_ID = this.configuration?.client;
      const ACA_MONGO_CLIENT_HASH = this.configuration?.clientHash;
      this.acaMongoClient = getAcaMongoClient(ACA_MONGO_CLIENT_ID, ACA_MONGO_CLIENT_HASH);
    } catch (error) {
      const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
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

  async initialize() {
    await this._ensureIndexes();
  }

  async _ensureIndexes() {
    try {
      const COLLECTIONS = this._collections;
      const DB = await this._getDB();
      await createIndex(
        DB,
        COLLECTIONS.validationEngagements,
        { key: 1 },
        { unique: true }
      );
    } catch (error) {
      const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
      ACA_ERROR.configuration = this.configuration;
      logger.error('_ensureIndexes', { ACA_ERROR });
      throw ACA_ERROR;
    }
  }

  get validationEngagements() {
    const RET_VAL = {
      findManyByQuery: async (context, params) => {
        return _validationEngagements.findManyByQuery(this, context, params);
      },
      findManyLiteByQuery: async (context, params) => {
        return _validationEngagements.findManyLiteByQuery(this, context, params);
      },
      deleteManyByIds: async (context, params) => {
        return _validationEngagements.deleteManyByIds(this, context, params);
      },
      deleteManyByKeys: async (context, params) => {
        return _validationEngagements.deleteManyByKeys(this, context, params);
      },
      findOneById: async (context, params) => {
        return _validationEngagements.findOneById(this, context, params);
      },
      findOneByKey: async (context, params) => {
        return _validationEngagements.findOneByKey(this, context, params);
      },
      saveOne: async (context, params) => {
        return _validationEngagements.saveOne(this, context, params);
      },
    };
    return RET_VAL;
  }

  get validationEngagementsChanges() {
    const RET_VAL = {
      findManyByQuery: async (context, params) => {
        return _validationEngagementsChanges.findManyByQuery(this, context, params);
      },
      saveOne: async (context, params) => {
        return _validationEngagementsChanges.saveOne(this, context, params);
      },
      findOneById: async (context, params) => {
        return _validationEngagementsChanges.findOneById(this, context, params);
      },
    };
    return RET_VAL;
  }

}

module.exports = {
  AcaValidationEngagementsDatasourceMongo,
};
