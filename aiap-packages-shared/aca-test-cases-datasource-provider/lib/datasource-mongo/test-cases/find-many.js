/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-test-cases-datasource-mongo-test-cases-find-many';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const ramda = require('@ibm-aca/aca-wrapper-ramda');
const lodash = require('@ibm-aca/aca-wrapper-lodash');

const ReadPreference = require('mongodb').ReadPreference;

const { formatIntoAcaError, appendDataToError } = require('@ibm-aca/aca-utils-errors');

const findMany = async (datasource, context, params) => {
  const CONTEXT_USER_ID = context?.user?.id;
  const COLLECTION = datasource._collections.testCases;
  try {
    const COLLECTION_OPTIONS = {
      readPreference: ReadPreference.SECONDARY_PREFERRED
    }

    const ACA_MONGO_CLIENT = await datasource._getAcaMongoClient();
    const RET_VAL = await ACA_MONGO_CLIENT
      .__findToArray(context, {
        collection: COLLECTION,
        collectionOptions: COLLECTION_OPTIONS
      });

    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, { CONTEXT_USER_ID, params });
    logger.error(findMany.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

module.exports = {
  findMany
}
