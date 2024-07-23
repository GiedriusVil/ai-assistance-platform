/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-jobs-queues-datasource-mongo';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const ramda = require('@ibm-aca/aca-wrapper-ramda');
const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { formatIntoAcaError, appendDataToError, throwAcaError, ACA_ERROR_TYPE } = require('@ibm-aca/aca-utils-errors');

const { AcaJobsQueuesDatasource } = require('../datasource');

const { getAcaMongoClient } = require('@ibm-aiap/aiap-mongo-client-provider');
const { createIndex } = require('@ibm-aiap/aiap-utils-mongo')

const { sanitizedCollectionsFromConfiguration } = require('./collections.utils');

const _jobsQueues = require('./jobs-queues');


class AcaJobsQueuesDatasourceMongo extends AcaJobsQueuesDatasource {

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

  async initialize() {
    await this._ensureIndexes();
  }

  async _ensureIndexes() {
    try {
      const DB = await this._getDB();
      const COLLECTIONS = this._collections;
      const FIELD = {
        JOBS_QUEUES: `jobsQueues.name`,
      };
      await createIndex(DB, COLLECTIONS.jobsQueues, { [FIELD.JOBS_QUEUES]: 1 });
    } catch (error) {
      const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
      logger.error('_ensureIndexes', { ACA_ERROR });
      throw ACA_ERROR;
    }
  }


  get jobsQueues() {
    const RET_VAL = {
      findManyByMatch: async (context, params) => {
        return _jobsQueues.findManyByMatch(this, context, params);
      },
      findManyByQuery: async (context, params) => {
        return _jobsQueues.findManyByQuery(this, context, params);
      },
      //
      deleteManyByIds: async (context, params) => {
        return _jobsQueues.deleteManyByIds(this, context, params);
      },
      findLiteOneById: async (context, params) => {
        return _jobsQueues.findLiteOneById(this, context, params);
      },
      findOneById: async (context, params) => {
        return _jobsQueues.findOneById(this, context, params);
      },
      saveOne: async (context, params) => {
        return _jobsQueues.saveOne(this, context, params);
      },
    };
    return RET_VAL;
  }
}

module.exports = {
  AcaJobsQueuesDatasourceMongo
};
