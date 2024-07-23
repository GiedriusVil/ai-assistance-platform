/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-rule-actions-datasource-mongo';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { formatIntoAcaError, throwAcaError, ACA_ERROR_TYPE, appendDataToError } = require('@ibm-aca/aca-utils-errors');

const { AcaRuleActionsDatasource } = require('../datasource');
const { getAcaMongoClient } = require('@ibm-aiap/aiap-mongo-client-provider');

const { sanitizedCollectionsFromConfiguration } = require('./collections.utils');

const _actions = require('./actions');
const _actionsAudits = require('./actions-audits');

class AcaRuleActionsDatasourceMongo extends AcaRuleActionsDatasource {

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

  get actions() {
    return {
      findManyByQuery: async (context, params) => {
        return _actions.findManyByQuery(this, context, params);
      },
      deleteManyByIds: async (context, params) => {
        return _actions.deleteManyByIds(this, context, params);
      },
      findOneById: async (context, params) => {
        return _actions.findOneById(this, context, params);
      },
      saveOne: async (context, params) => {
        return _actions.saveOne(this, context, params);
      },
    };
  }

  get actionsAudits() {
    return {
      findManyByQuery: async (context, params) => {
        return _actionsAudits.findManyByQuery(this, context, params);
      },
      deleteManyByIds: async (context, params) => {
        return _actionsAudits.deleteManyByIds(this, context, params);
      },
      deleteOneById: async (context, params) => {
        return _actionsAudits.deleteOneById(this, context, params);
      },
      findOneById: async (context, params) => {
        return _actionsAudits.findOneById(this, context, params);
      },
      saveOne: async (context, params) => {
        return _actionsAudits.saveOne(this, context, params);
      },
    };
  }


}

module.exports = {
  AcaRuleActionsDatasourceMongo,
};
