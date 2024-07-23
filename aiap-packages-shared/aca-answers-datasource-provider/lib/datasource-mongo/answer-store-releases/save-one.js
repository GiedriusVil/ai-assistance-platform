
/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'answers-datasource-mongo-answer-store-releases-save-one';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const ramda = require('@ibm-aca/aca-wrapper-ramda');
const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { v4: uuidv4 } = require('uuid');

const { formatIntoAcaError, appendDataToError } = require('@ibm-aca/aca-utils-errors');

const { findOneById } = require('./find-one-by-id');

const saveOne = async (datasource, context, params) => {
  const CONTEXT_USER_ID = context?.user?.id;

  const COLLECTION = datasource._collections.answerStoreReleases;

  const PARAMS_ANSWER_STORE_RELEASE = params?.answerStoreRelease;
  const PARAMS_ANSWER_STORE_RELEASE_ID = params?.answerStoreRelease?.id;

  let answerStoreReleaseId;
  let filter;
  let updateCondition;
  let updateOptions;
  try {
    answerStoreReleaseId = lodash.isEmpty(PARAMS_ANSWER_STORE_RELEASE_ID) ? uuidv4() : PARAMS_ANSWER_STORE_RELEASE_ID;
    updateCondition = { $set: PARAMS_ANSWER_STORE_RELEASE };
    updateOptions = { upsert: true };
    filter = { _id: answerStoreReleaseId };
    const ACA_MONGO_CLIENT = await datasource._getAcaMongoClient();
    await ACA_MONGO_CLIENT
      .__updateOne(context,
        {
          collection: COLLECTION,
          filter: filter,
          update: updateCondition,
          options: updateOptions
        });

    const RET_VAL = await findOneById(datasource, context, { id: answerStoreReleaseId });
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, { CONTEXT_USER_ID, params, filter });
    logger.error(saveOne.name, { ACA_ERROR });
  }
}

module.exports = {
  saveOne
}
