/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-conversations-datasoure-utterances-update-many-by-params';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const ramda = require('@ibm-aca/aca-wrapper-ramda');

const { appendDataToError, formatIntoAcaError } = require('@ibm-aca/aca-utils-errors');
const {
  setAttribute
} = require('@ibm-aiap/aiap-utils-mongo');

const updateManyByParams = async (datasource, context, params) => {
  const CONTEXT_USER_ID = context?.user?.id;

  const COLLECTION = datasource._collections.utterances;

  let filter;
  try {
    filter = {};
    const SERVICE_ID = ramda.path(['utterance', 'serviceId'], params);

    const UPDATE_PIPELINE = [
      setAttribute('serviceId', SERVICE_ID),
    ];

    const ACA_MONGO_CLIENT = await datasource._getAcaMongoClient();
    const RESPONSE = await ACA_MONGO_CLIENT
      .__updateMany(context,
        {
          collection: COLLECTION,
          filter: filter,
          update: UPDATE_PIPELINE
        });

    const RET_VAL = {
      modified: ramda.pathOr(0, ['modifiedCount'], RESPONSE)
    }
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, { CONTEXT_USER_ID, filter, params });
    logger.error(updateManyByParams.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

module.exports = {
  updateManyByParams
};
