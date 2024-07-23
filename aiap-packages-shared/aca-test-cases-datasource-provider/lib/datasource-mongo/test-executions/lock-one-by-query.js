/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-test-cases-datasource-mongo-test-executions-lock-one-by-query';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const ramda = require('@ibm-aca/aca-wrapper-ramda');
const lodash = require('@ibm-aca/aca-wrapper-lodash');

const ReadPreference = require('mongodb').ReadPreference;

const { formatIntoAcaError, throwAcaError, ACA_ERROR_TYPE } = require('@ibm-aca/aca-utils-errors');
const { sanitizeIdAttribute } = require('@ibm-aiap/aiap-utils-mongo');

const lockOneByQuery = async (datasource, context, params) => {
  const CONTEXT_USER_ID = context?.user?.id;
  const COLLECTION = datasource._collections.testExecutions;

  let filter;
  try {
    const WORKER_ID = params?.worker?.id;
    const STATUSES = ramda.pathOr([], ['statuses'], params);
    if (
      lodash.isEmpty(WORKER_ID)
    ) {
      const MESSAGE = `Missing required params.worker.id parameter!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }
    const COLLECTION_OPTIONS = {
      readPreference: ReadPreference.SECONDARY_PREFERRED
    }
    filter = {
      'worker.id': {
        $eq: WORKER_ID
      },
      status: {
        $in: STATUSES
      },
      lock: {
        $ne: true
      }
    };
    const UPDATE = {
      $set: {
        lock: true
      }
    }

    const ACA_MONGO_CLIENT = await datasource._getAcaMongoClient();
    const RESULT = await ACA_MONGO_CLIENT
      .__findOneAndUpdate(context, {
        collection: COLLECTION,
        collectionOptions: COLLECTION_OPTIONS,
        filter: filter,
        update: UPDATE
      });
    const RET_VAL = ramda.path(['value'], RESULT);
    if (!lodash.isEmpty(RET_VAL)) {
      sanitizeIdAttribute(RET_VAL);
    }
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error('->', { ACA_ERROR });
    throw error;
  }
}

module.exports = {
  lockOneByQuery,
}
