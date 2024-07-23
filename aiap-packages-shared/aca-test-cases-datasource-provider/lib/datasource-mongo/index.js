/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-test-cases-datasource-mongo';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const ramda = require('@ibm-aca/aca-wrapper-ramda');
const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { formatIntoAcaError, appendDataToError, ACA_ERROR_TYPE, throwAcaError } = require('@ibm-aca/aca-utils-errors');

const { AcaTestCasesDatasource } = require('../datasource');
const { getAcaMongoClient } = require('@ibm-aiap/aiap-mongo-client-provider');

const { sanitizedCollectionsFromConfiguration } = require('./collections.utils');

const _testWorkers = require('./test-workers');
const _testCases = require('./test-cases');
const _testExecutions = require('./test-executions');

class AcaTestCasesDatasourceMongo extends AcaTestCasesDatasource {

  constructor(configuration) {
    try {
      super(configuration);

      this._collections = sanitizedCollectionsFromConfiguration(this.configuration);

      const ACA_MONGO_CLIENT_ID = ramda.path(['client'], this.configuration);
      const ACA_MONGO_CLIENT_HASH = ramda.path(['clientHash'], this.configuration);

      this.acaMongoClient = getAcaMongoClient(ACA_MONGO_CLIENT_ID, ACA_MONGO_CLIENT_HASH);

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

  async initialize() { }

  get workers() {
    return {
      saveOne: async (context, params) => {
        return _testWorkers.saveOne(this, context, params);
      },
      findManyByQuery: async (context, params) => {
        return _testWorkers.findManyByQuery(this, context, params);
      },
      findOneById: async (context, params) => {
        return _testWorkers.findOneById(this, context, params);
      },
      deleteManyByIds: async (context, params) => {
        return _testWorkers.deleteManyByIds(this, context, params);
      },
    };
  }

  get cases() {
    return {
      saveOne: async (context, params) => {
        return _testCases.saveOne(this, context, params);
      },
      findManyByQuery: async (context, params) => {
        return _testCases.findManyByQuery(this, context, params);
      },
      findOneById: async (context, params) => {
        return _testCases.findOneById(this, context, params);
      },
      deleteManyByIds: async (context, params) => {
        return _testCases.deleteManyByIds(this, context, params);
      },
    };
  }

  get executions() {
    return {
      saveOne: async (context, params) => {
        return _testExecutions.saveOne(this, context, params);
      },
      findManyByQuery: async (context, params) => {
        return _testExecutions.findManyByQuery(this, context, params);
      },
      findOneById: async (context, params) => {
        return _testExecutions.findOneById(this, context, params);
      },
      deleteManyByIds: async (context, params) => {
        return _testExecutions.deleteManyByIds(this, context, params);
      },
      lockOneByQuery: async (context, params) => {
        return _testExecutions.lockOneByQuery(this, context, params);
      },
    };
  }
}

module.exports = {
  AcaTestCasesDatasourceMongo,
};
