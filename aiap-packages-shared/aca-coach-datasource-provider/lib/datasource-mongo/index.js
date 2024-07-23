/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-coach-datasource-mongo';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const ramda = require('@ibm-aca/aca-wrapper-ramda');
const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { formatIntoAcaError, appendDataToError, throwAcaError, ACA_ERROR_TYPE } = require('@ibm-aca/aca-utils-errors');

const { getAcaMongoClient } = require('@ibm-aiap/aiap-mongo-client-provider');

const { AcaCoachDatasource } = require('../datasource');

const { sanitizedCollectionsFromConfiguration } = require('./collections.utils');

const _stopWatchMetrics = require('./stop-watch-metrics');

class AcaCoachDatasourceMongo extends AcaCoachDatasource {

  constructor(configuration) {
    super(configuration);
    try {
      this._collections = sanitizedCollectionsFromConfiguration(this.configuration);

      const ACA_MONGO_CLIENT_ID = ramda.path(['client'], this.configuration);
      const ACA_MONGO_CLIENT_HASH = ramda.path(['clientHash'], this.configuration);

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

  get stopWatchMetrics() {
    return {
      saveOne: async (context, params) => {
        return _stopWatchMetrics.saveOne(this, context, params);
      },
      findManyByQuery: async (context, params) => {
        return _stopWatchMetrics.findManyByQuery(this, context, params);
      },
      findOneById: async (context, params) => {
        return _stopWatchMetrics.findOneById(this, context, params);
      },
      deleteManyByIds: async (context, params) => {
        return _stopWatchMetrics.deleteManyByIds(this, context, params);
      },
    };
  }

}

module.exports = {
  AcaCoachDatasourceMongo,
};
