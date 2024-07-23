/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-oauth2-datasource-mongo'
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { formatIntoAcaError, ACA_ERROR_TYPE, throwAcaError } = require('@ibm-aca/aca-utils-errors');
const { getAcaMongoClient } = require('@ibm-aiap/aiap-mongo-client-provider');

const { AcaOauth2Datasource } = require('../datasource');
const { sanitizedCollectionsFromConfiguration } = require('./collections.utils');

const _oauth2TokensRefresh = require('./oauth2-tokens-refresh');

class AcaOauth2DatasourceMongo extends AcaOauth2Datasource {

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

  async init() {
    try {
      logger.info('init - skip non of indexes!')
    } catch (error) {
      const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
      logger.error('init', { ACA_ERROR });
      throw ACA_ERROR;
    }
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
        const ERROR_MESSAGE = `Unable to retrieve AcaMongoClient!`;
        throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, ERROR_MESSAGE);
      }
      return retVal;
    } catch (error) {
      const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
      logger.error('_getAcaMongoClient', { ACA_ERROR });
      throw ACA_ERROR;
    }
  }

  async initialize() { }

  get oauth2TokensRefresh() {
    return {
      findManyByQuery: async (context, params) => {
        return _oauth2TokensRefresh.findManyByQuery(this, context, params);
      },
      findOneById: async (context, params) => {
        return _oauth2TokensRefresh.findOneById(this, context, params);
      },
      saveOne: async (context, params) => {
        return _oauth2TokensRefresh.saveOne(this, context, params);
      },
    };
  }

}

module.exports = {
  AcaOauth2DatasourceMongo,
};
