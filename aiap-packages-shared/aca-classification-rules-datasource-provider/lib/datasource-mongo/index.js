/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-classification-rules-datasource-mongo';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const ramda = require('@ibm-aca/aca-wrapper-ramda');
const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { AcaClassificationRulesDatasource } = require('../datasource');
const { getAcaMongoClient } = require('@ibm-aiap/aiap-mongo-client-provider');

const { formatIntoAcaError, throwAcaError, ACA_ERROR_TYPE, appendDataToError } = require('@ibm-aca/aca-utils-errors');

const { sanitizedCollectionsFromConfiguration } = require('./collections.utils');

const _rules = require('./rules');
const _rulesAudits = require('./rules-audits');
const _conditions = require('./rules-conditions');
const _classifications = require('./rules-classifications');

class AcaClassificationRulesDatasourceMongo extends AcaClassificationRulesDatasource {

  constructor(configuration) {
    try {
      super(configuration);
      this._collections = sanitizedCollectionsFromConfiguration(this.configuration);
      this.mongoClientName = this.configuration?.client;
      this.mongoClientHash = this.configuration?.clientHash;
      this.acaMongoClient = getAcaMongoClient(this.mongoClientName, this.mongoClientHash);
    } catch (error) {
      const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
      appendDataToError(ACA_ERROR, { configuration });
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

  async initialize() { }

  get rules() {
    return {
      saveOne: async (context, params) => {
        return _rules.saveOne(this, context, params);
      },
      findManyByQuery: async (context, params) => {
        return _rules.findManyByQuery(this, context, params);
      },
      findOneById: async (context, params) => {
        return _rules.findOneById(this, context, params);
      },
      deleteManyByIds: async (context, params) => {
        return _rules.deleteManyByIds(this, context, params);
      },
    };
  }

  get rulesConditions() {
    return {
      saveOne: async (context, params) => {
        return _conditions.saveOne(this, context, params);
      },
      findManyByQuery: async (context, params) => {
        return _conditions.findManyByQuery(this, context, params);
      },
      findOneById: async (context, params) => {
        return _conditions.findOneById(this, context, params);
      },
      deleteManyByIds: async (context, params) => {
        return _conditions.deleteManyByIds(this, context, params);
      },
      deleteManyByRuleId: async (context, params) => {
        return _conditions.deleteManyByRuleId(this, context, params);
      },
    };
  }

  get rulesClassifications() {
    return {
      saveOne: async (context, params) => {
        return _classifications.saveOne(this, context, params);
      },
      findManyByQuery: async (context, params) => {
        return _classifications.findManyByQuery(this, context, params);
      },
      findOneById: async (context, params) => {
        return _classifications.findOneById(this, context, params);
      },
      deleteManyByIds: async (context, params) => {
        return _classifications.deleteManyByIds(this, context, params);
      },
      deleteManyByRuleId: async (context, params) => {
        return _classifications.deleteManyByRuleId(this, context, params);
      },
    };
  }

  get rulesAudits() {
    return {
      findManyByQuery: async (context, params) => {
        return _rulesAudits.findManyByQuery(this, context, params);
      },
      deleteManyByIds: async (context, params) => {
        return _rulesAudits.deleteManyByIds(this, context, params);
      },
      deleteOneById: async (context, params) => {
        return _rulesAudits.deleteOneById(this, context, params);
      },
      findOneById: async (context, params) => {
        return _rulesAudits.findOneById(this, context, params);
      },
      saveOne: async (context, params) => {
        return _rulesAudits.saveOne(this, context, params);
      },
    };
  }
}

module.exports = {
  AcaClassificationRulesDatasourceMongo,
};
