/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-rules-datasource-mongo';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { formatIntoAcaError, ACA_ERROR_TYPE, throwAcaError } = require('@ibm-aca/aca-utils-errors');
const { getAcaMongoClient } = require('@ibm-aiap/aiap-mongo-client-provider');

const { AcaRulesDatasource } = require('../datasource');
const { sanitizedCollectionsFromConfiguration } = require('./collections.utils');

const _rules = require('./rules');
const _rulesReleases = require('./rules-releases');
const _rulesImport = require('./rules-import');
const _rulesMessages = require('./rules-messages');
const _messagesReleases = require('./messages-releases');

class AcaRulesDatasourceMongo extends AcaRulesDatasource {

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
    const DB = this._getDB();
    if (
      this.configuration.defaultRulesEnabled
    ) {
      _rules.ensureDefaultRules(DB, this._collections);
    }
    if (
      this.configuration.defaultMessagesEnabled
    ) {
      _rulesMessages.ensureDefaultMessages(DB, this._collections);
    }
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
      deleteManyByIds: async (context, params) => {
        return _rules.deleteManyByIds(this, context, params);
      },
    };
  }

  get rulesReleases() {
    const RET_VAL = {
      saveOne: async (context, params) => {
        return _rulesReleases.saveOne(this, context, params);
      },
    };
    return RET_VAL;
  }

  get rulesImport() {
    return {
      findManyByQuery: async (context, params) => {
        return _rulesImport.findManyByQuery(this, context, params);
      },
      findOneById: async (context, params) => {
        return _rulesImport.findOneById(this, context, params);
      },
      saveOne: async (context, params) => {
        return _rulesImport.saveOne(this, context, params);
      },
      deleteOneById: async (context, params) => {
        return _rulesImport.deleteOneById(this, context, params);
      },
      deleteManyByIds: async (context, params) => {
        return _rulesImport.deleteManyByIds(this, context, params);
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
      deleteManyByIds: async (context, params) => {
        return _rulesMessages.deleteManyByIds(this, context, params);
      },
    };
  }

  get messagesReleases() {
    const RET_VAL = {
      saveOne: async (context, params) => {
        return _messagesReleases.saveOne(this, context, params);
      },
    };
    return RET_VAL;
  }

}


module.exports = {
  AcaRulesDatasourceMongo
};
