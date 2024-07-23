/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-ai-search-and-analysis-services-datasource-mongo';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { formatIntoAcaError, appendDataToError, ACA_ERROR_TYPE, throwAcaError } = require('@ibm-aca/aca-utils-errors');

const { AcaAiSearchAndAnalysisServicesDatasource } = require('../datasource');

const { getAcaMongoClient } = require('@ibm-aiap/aiap-mongo-client-provider');

const { sanitizedCollectionsFromConfiguration } = require('./collections.utils');

const aiSearchAndAnalysisServices = require('./ai-search-and-analysis-services');
const aiSearchAndAnalysisProjects = require('./ai-search-and-analysis-projects');
const aiSearchAndAnalysisCollections = require('./ai-search-and-analysis-collections');

class AcaAiSearchAndAnalysisServicesDatasourceMongo extends AcaAiSearchAndAnalysisServicesDatasource {

  constructor(configuration) {
    super(configuration);
    try {
      this.configuration.encryptionKey = 'someKey';

      this._collections = sanitizedCollectionsFromConfiguration(this.configuration);

      const ACA_MONGO_CLIENT_ID = this.configuration?.client;
      const ACA_MONGO_CLIENT_HASH = this.configuration?.clientHash;

      this.acaMongoClient = getAcaMongoClient(ACA_MONGO_CLIENT_ID, ACA_MONGO_CLIENT_HASH);
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
      // TODO: need to define indexes
    } catch (error) {
      const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
      ACA_ERROR.configuration = this.configuration;
      logger.error(this._ensureIndexes.name, { ACA_ERROR });
      throw ACA_ERROR;
    }
  }

  get aiSearchAndAnalysisServices() {
    return {
      findManyByQuery: async (context, params) => {
        return aiSearchAndAnalysisServices.findManyByQuery(this, context, params);
      },
      findOneById: async (context, params) => {
        return aiSearchAndAnalysisServices.findOneById(this, context, params);
      },
      saveOne: async (context, params) => {
        return aiSearchAndAnalysisServices.saveOne(this, context, params);
      },
      deleteManyByIds: async (context, params) => {
        return aiSearchAndAnalysisServices.deleteManyByIds(this, context, params);
      },
    };
  }

  get aiSearchAndAnalysisProjects() {
    return {
      findManyByQuery: async (context, params) => {
        return aiSearchAndAnalysisProjects.findManyByQuery(this, context, params);
      },
      findOneById: async (context, params) => {
        return aiSearchAndAnalysisProjects.findOneById(this, context, params);
      },
      saveOne: async (context, params) => {
        return aiSearchAndAnalysisProjects.saveOne(this, context, params);
      },
      deleteManyByIds: async (context, params) => {
        return aiSearchAndAnalysisProjects.deleteManyByIds(this, context, params);
      },
    };
  }

  get aiSearchAndAnalysisCollections() {
    return {
      findManyByQuery: async (context, params) => {
        return aiSearchAndAnalysisCollections.findManyByQuery(this, context, params);
      },
      findOneById: async (context, params) => {
        return aiSearchAndAnalysisCollections.findOneById(this, context, params);
      },
      saveOne: async (context, params) => {
        return aiSearchAndAnalysisCollections.saveOne(this, context, params);
      },
      deleteManyByIds: async (context, params) => {
        return aiSearchAndAnalysisCollections.deleteManyByIds(this, context, params);
      },
      deleteManyByProjectId: async (context, params) => {
        return aiSearchAndAnalysisCollections.deleteManyByProjectId(this, context, params);
      },
    }
  }
}

module.exports = {
  AcaAiSearchAndAnalysisServicesDatasourceMongo,
};
