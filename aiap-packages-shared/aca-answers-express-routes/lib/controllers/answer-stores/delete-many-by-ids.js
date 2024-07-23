/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-answer-stores-express-router-controllers-answer-stores-delete-many-by-ids';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { ACA_ERROR_TYPE, throwAcaError, formatIntoAcaError } = require('@ibm-aca/aca-utils-errors');
const { constructActionContextFromRequest } = require('@ibm-aiap/aiap-utils-express-routes');

const { answerStoresService } = require('@ibm-aca/aca-answers-service');

const deleteManyByIds = async (request, response) => {
  let retVal;
  const ERRORS = [];

  const CONTEXT = constructActionContextFromRequest(request);

  const IDS = request?.body?.ids;
  const REASON = request?.body?.reason;
  if (
    lodash.isEmpty(IDS)
  ) {
    const MESSAGE = `Missing required request.body parameter!`;
    throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
  }
  if (
    !lodash.isArray(IDS)
  ) {
    const MESSAGE = `Wrong type request.body.ids parameter! [Expected - Array]`;
    throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
  }
  try {
    const PARAMS = { ids: IDS, reason: REASON };
    retVal = await answerStoresService.deleteManyByIds(CONTEXT, PARAMS);
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
  deleteManyByIds,
}
