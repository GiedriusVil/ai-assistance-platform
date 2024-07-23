/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-answers-datasource-mongo';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const ramda = require('@ibm-aca/aca-wrapper-ramda');
const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { formatIntoAcaError, appendDataToError, throwAcaError, ACA_ERROR_TYPE } = require('@ibm-aca/aca-utils-errors');

const { AcaAnswersDatasource } = require('../datasource');
const { getAcaMongoClient } = require('@ibm-aiap/aiap-mongo-client-provider');
const { createIndex } = require('@ibm-aiap/aiap-utils-mongo')

const { sanitizedCollectionsFromConfiguration } = require('./collections.utils');

const _answers = require('./answers');
const _answerStores = require('./answer-stores');
const _answerStoreReleases = require('./answer-store-releases');

class AcaAnswersDatasourceMongo extends AcaAnswersDatasource {

  constructor(configuration) {
    try {
      super(configuration);

      this._collections = sanitizedCollectionsFromConfiguration(this.configuration);

      const ACA_MONGO_CLIENT_ID = ramda.path(['client'], this.configuration);
      const ACA_MONGO_CLIENT_HASH = ramda.path(['clientHash'], this.configuration);

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
        const ACA_MONGO_CLIENT_ID = ramda.path(['client'], this.configuration);
        const ACA_MONGO_CLIENT_HASH = ramda.path(['clientHash'], this.configuration);

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
      await createIndex(DB, COLLECTIONS.answerStoreReleases, { created: 1 });
      await createIndex(DB, COLLECTIONS.answerStoreReleases, { answerStoreId: 1 });
      await createIndex(DB, COLLECTIONS.answerStores, { created: 1 });
      await createIndex(DB, COLLECTIONS.answerStores, { assistantId: 1 });
      await createIndex(DB, COLLECTIONS.answers, { 'answers.values.text': 1 });
      await createIndex(DB, COLLECTIONS.answers, { 'answers.values.text': 'text' });
    } catch (error) {
      const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
      ACA_ERROR.configuration = this.configuration;
      logger.error(this._ensureIndexes.name, { ACA_ERROR });
      throw ACA_ERROR;
    }
  }

  get answers() {
    const RET_VAL = {
      findManyByActionTagId: async (context, params) => {
        return _answers.findManyByActionTagId(this, context, params);
      },
      findManyByQuery: async (context, params) => {
        return _answers.findManyByQuery(this, context, params);
      },
      findOneByKey: async (context, params) => {
        return _answers.findOneByKey(this, context, params);
      },
      saveOne: async (context, params) => {
        return _answers.saveOne(this, context, params);
      },
      deleteManyByKeys: async (context, params) => {
        return _answers.deleteManyByKeys(this, context, params);
      },
      importMany: async (context, params) => {
        return _answers.importMany(this, context, params);
      }
    };
    return RET_VAL;
  }

  get answerStores() {
    const RET_VAL = {
      deleteManyByIds: async (context, params) => {
        return _answerStores.deleteManyByIds(this, context, params);
      },
      findManyByQuery: async (context, params) => {
        return _answerStores.findManyByQuery(this, context, params);
      },
      findManyLiteByQuery: async (context, params) => {
        return _answerStores.findManyLiteByQuery(this, context, params);
      },
      findOneLiteById: async (context, params) => {
        return _answerStores.findOneLiteById(this, context, params);
      },
      findOneByReference: async (context, params) => {
        return _answerStores.findOneByReference(this, context, params);
      },
      findOneById: async (context, params) => {
        return _answerStores.findOneById(this, context, params);
      },
      saveOne: async (context, params) => {
        return _answerStores.saveOne(this, context, params);
      },
      deleteOne: async (context, params) => {
        return _answerStores.deleteOne(this, context, params);
      },
    };
    return RET_VAL;
  }

  get answerStoreReleases() {
    const RET_VAL = {
      findManyByQuery: async (context, params) => {
        return _answerStoreReleases.findManyByQuery(this, context, params);
      },
      findOneById: async (context, params) => {
        return _answerStoreReleases.findOneById(this, context, params);
      },
      saveOne: async (context, params) => {
        return _answerStoreReleases.saveOne(this, context, params);
      },
      deleteOne: async (context, params) => {
        return _answerStoreReleases.deleteOne(this, context, params);
      },
    };
    return RET_VAL;
  }
}


module.exports = {
  AcaAnswersDatasourceMongo
};
