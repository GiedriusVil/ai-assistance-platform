/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-buy-rules-datasource-mongo';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { formatIntoAcaError, throwAcaError, ACA_ERROR_TYPE, appendDataToError } = require('@ibm-aca/aca-utils-errors');

const { AcaBuyRulesDatasource } = require('../datasource');
const { getAcaMongoClient } = require('@ibm-aiap/aiap-mongo-client-provider');

const { sanitizedCollectionsFromConfiguration } = require('./collections.utils');

const _rules = require('./rules');
const _rulesAudits = require('./rules-audits');
const _rulesConditions = require('./rules-conditions');
const _rulesSuppliers = require('./rules-suppliers');

class AcaBuyRulesDatasourceMongo extends AcaBuyRulesDatasource {

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
      findManyByQuery: async (context, params) => {
        return _rules.findManyByQuery(this, context, params);
      },
      deleteManyByIds: async (context, params) => {
        return _rules.deleteManyByIds(this, context, params);
      },
      findOneById: async (context, params) => {
        return _rules.findOneById(this, context, params);
      },
      saveOne: async (context, params) => {
        return _rules.saveOne(this, context, params);
      },
    };
  }

  get rulesConditions() {
    return {
      findManyByQuery: async (context, params) => {
        return _rulesConditions.findManyByQuery(this, context, params);
      },
      deleteManyByIds: async (context, params) => {
        return _rulesConditions.deleteManyByIds(this, context, params);
      },
      deleteManyByRuleId: async (context, params) => {
        return _rulesConditions.deleteManyByRuleId(this, context, params);
      },
      findOneById: async (context, params) => {
        return _rulesConditions.findOneById(this, context, params);
      },
      saveOne: async (context, params) => {
        return _rulesConditions.saveOne(this, context, params);
      },
    };
  }

  get rulesSuppliers() {
    return {
      findManyByQuery: async (context, params) => {
        return _rulesSuppliers.findManyByQuery(this, context, params);
      },
      deleteManyByIds: async (context, params) => {
        return _rulesSuppliers.deleteManyByIds(this, context, params);
      },
      deleteManyByRuleId: async (context, params) => {
        return _rulesSuppliers.deleteManyByRuleId(this, context, params);
      },
      findOneById: async (context, params) => {
        return _rulesSuppliers.findOneById(this, context, params);
      },
      saveOne: async (context, params) => {
        return _rulesSuppliers.saveOne(this, context, params);
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
  AcaBuyRulesDatasourceMongo,
};
