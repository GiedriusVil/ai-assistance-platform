/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-answers-express-router-controllers-answers-delete-many-by-keys';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { formatIntoAcaError, throwAcaError, ACA_ERROR_TYPE } = require('@ibm-aca/aca-utils-errors');
const { constructActionContextFromRequest } = require('@ibm-aiap/aiap-utils-express-routes');

const { answersService } = require('@ibm-aca/aca-answers-service');

const deleteManyByKeys = async (request, response) => {
  let retVal;
  const ERRORS = [];

  const CONTEXT = constructActionContextFromRequest(request);
  const KEYS = request?.body?.keys;
  const REASON = request?.body?.reason;
  const ANSWER_STORE_ID = request?.params?.answerStoreId;
  if (
    lodash.isEmpty(ANSWER_STORE_ID)
  ) {
    const MESSAGE = `Missing required request.params.answerStoreId parameter!`;
    throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
  }
  if (
    lodash.isEmpty(KEYS)
  ) {
    const MESSAGE = `Missing required request.body.keys parameter!`;
    throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
  }
  if (
    !lodash.isArray(KEYS)
  ) {
    const MESSAGE = `Wrong type request.body.keys parameter! [Expected - Array]`;
    throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
  }
  try {
    const PARAMS = { keys: KEYS, reason: REASON, answerStoreId: ANSWER_STORE_ID };
    retVal = await answersService.deleteManyByKeys(CONTEXT, PARAMS);
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    ERRORS.push(ACA_ERROR);
  }
  if (
    !lodash.isEmpty(ERRORS)
  ) {
    logger.error('ERRORS', { ERRORS });
    response.status(500).json(ERRORS);
  } else {
    response.status(200).json(retVal);
  }
}

module.exports = {
  deleteManyByKeys,
}
