/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'app-datasource-mongo-answer-stores-find-one-by-answer-store-reference';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const ramda = require('@ibm-aca/aca-wrapper-ramda');
const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { formatIntoAcaError, appendDataToError, throwAcaError, ACA_ERROR_TYPE } = require('@ibm-aca/aca-utils-errors');
const { sanitizeIdAttribute } = require('@ibm-aiap/aiap-utils-mongo');

const findOneByReference = async (datasource, context, params) => {
  const CONTEXT_USER_ID = context?.user?.id;
  const COLLECTION = datasource._collections.answerStores;
  const PARAMS_ANSWER_STORE_REFERENCE = params?.reference;
  let filter;
  try {
    if (
      lodash.isEmpty(PARAMS_ANSWER_STORE_REFERENCE)
    ) {
      const MESSAGE = `Missing required params?.reference parameter!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }
    filter = {
      reference: {
        $eq: PARAMS_ANSWER_STORE_REFERENCE
      }
    };
    const ACA_MONGO_CLIENT = await datasource._getAcaMongoClient();
    const RESPONSE = await ACA_MONGO_CLIENT
      .__findToArray(context, {
        collection: COLLECTION,
        filter: filter,
      });

    const RET_VAL = ramda.pathOr({}, [0], RESPONSE);
    sanitizeIdAttribute(RET_VAL);
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, { CONTEXT_USER_ID, params, filter });
    logger.error(findOneByReference.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

module.exports = {
  findOneByReference
}
