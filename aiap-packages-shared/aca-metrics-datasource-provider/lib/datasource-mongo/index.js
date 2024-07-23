/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-metrics-datasource-provider-metrics-datasource-mongo'
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { formatIntoAcaError, ACA_ERROR_TYPE, throwAcaError } = require('@ibm-aca/aca-utils-errors');
const { getAcaMongoClient } = require('@ibm-aiap/aiap-mongo-client-provider');

const { AcaMetricsDatasource } = require('../datasource');
const { sanitizedCollectionsFromConfiguration } = require('./collections.utils');

const _purchaseRequests = require('./purchase-requests');
const _docValidations = require('./doc-validations');

class AcaMetricsDatasourceMongo extends AcaMetricsDatasource {

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

  async initialize() { }

  get purchaseRequests() {
    return {
      findManyByQuery: async (context, params) => {
        return _purchaseRequests.findManyByQuery(this, context, params);
      },
      findOneById: async (context, params) => {
        return _purchaseRequests.findOneById(this, context, params);
      },
      totalReceivedValidations: async (context, params) => {
        return _purchaseRequests.totalReceivedValidations(this, context, params);
      },
      totalCompletedValidations: async (context, params) => {
        return _purchaseRequests.totalCompletedValidations(this, context, params);
      },
      totalApprovedValidations: async (context, params) => {
        return _purchaseRequests.totalApprovedValidations(this, context, params);
      },
      totalRejectedValidations: async (context, params) => {
        return _purchaseRequests.totalRejectedValidations(this, context, params);
      },
      uniqueBuyers: async (context, params) => {
        return _purchaseRequests.uniqueBuyers(this, context, params);
      },
      countByDay: async (context, params) => {
        return _purchaseRequests.countByDay(this, context, params);
      },
      countByValidations: async (context, params) => {
        return _purchaseRequests.countByValidations(this, context, params);
      },
      totalValidatedPRs: async (context, params) => {
        return _purchaseRequests.totalValidatedPRs(this, context, params);
      },
      totalApprovedPRs: async (context, params) => {
        return _purchaseRequests.totalApprovedPRs(this, context, params);
      },
      totalRejectedPRs: async (context, params) => {
        return _purchaseRequests.totalRejectedPRs(this, context, params);
      },
      validationFrequency: async (context, params) => {
        return _purchaseRequests.validationFrequency(this, context, params);
      }
    };
  }

  get docValidations() {
    return {
      totalValidationRequestsByDay: async (context, params) => {
        return _docValidations.totalValidationRequestsByDay(this, context, params);
      },
      countRuleFrequency: async (context, params) => {
        return _docValidations.countRuleFrequency(this, context, params);
      }
    }
  }
}

module.exports = {
  AcaMetricsDatasourceMongo,
};
