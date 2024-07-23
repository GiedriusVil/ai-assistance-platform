/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-rules-datasource-provider-v2-datasource-mongo';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { formatIntoAcaError, throwAcaError, ACA_ERROR_TYPE } = require('@ibm-aca/aca-utils-errors');

const { getAcaMongoClient } = require('@ibm-aiap/aiap-mongo-client-provider');
const { createIndex } = require('@ibm-aiap/aiap-utils-mongo')

const { AcaRulesDatasourceV2 } = require('../datasource');
const { sanitizedCollectionsFromConfiguration } = require('./collections.utils');

const _rules = require('./rules');
const _rulesConditions = require('./rules-conditions');
const _rulesChanges = require('./rules-changes');

class AcaRulesDatasourceV2Mongo extends AcaRulesDatasourceV2 {

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
        COLLECTIONS.rulesV2,
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

  get rules() {
    const RET_VAL = {
      findManyByQuery: async (context, params) => {
        return _rules.findManyByQuery(this, context, params);
      },
      deleteManyByIds: async (context, params) => {
        return _rules.deleteManyByIds(this, context, params);
      },
      deleteManyByKeys: async (context, params) => {
        return _rules.deleteManyByKeys(this, context, params);
      },
      findOneById: async (context, params) => {
        return _rules.findOneById(this, context, params);
      },
      saveOne: async (context, params) => {
        return _rules.saveOne(this, context, params);
      },
    };
    return RET_VAL;
  }


  get rulesConditions() {
    const RET_VAL = {
      findManyByQuery: async (context, params) => {
        return _rulesConditions.findManyByQuery(this, context, params);
      },
      deleteManyByIds: async (context, params) => {
        return _rulesConditions.deleteManyByIds(this, context, params);
      },
      deleteManyByRuleId: async (context, params) => {
        return _rulesConditions.deleteManyByRuleId(this, context, params);
      },
      deleteManyByRuleKey: async (context, params) => {
        return _rulesConditions.deleteManyByRuleKey(this, context, params);
      },
      findOneById: async (context, params) => {
        return _rulesConditions.findOneById(this, context, params);
      },
      saveOne: async (context, params) => {
        return _rulesConditions.saveOne(this, context, params);
      },
    };
    return RET_VAL;
  }

  get rulesChanges() {
    const RET_VAL = {
      findManyByQuery: async (context, params) => {
        return _rulesChanges.findManyByQuery(this, context, params);
      },
      saveOne: async (context, params) => {
        return _rulesChanges.saveOne(this, context, params);
      },
      findOneById: async (context, params) => {
        return _rulesChanges.findOneById(this, context, params);
      },
    };
    return RET_VAL;
  }
}

module.exports = {
  AcaRulesDatasourceV2Mongo,
};
