/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-answers-express-routes-answer-store-releases-rollback-one';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const ramda = require('@ibm-aca/aca-wrapper-ramda');
const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { formatIntoAcaError } = require('@ibm-aca/aca-utils-errors');

const { constructActionContextFromRequest } = require('@ibm-aiap/aiap-utils-express-routes');

const { answerStoreReleasesService } = require('@ibm-aca/aca-answers-service');

const rollbackOne = async (request, response) => {
  const ERRORS = [];
  let retVal;
  try {
    const ANSWER_STORE_RELEASE_ID = request?.body?.answerStoreReleaseId;
    const CONTEXT = constructActionContextFromRequest(request);
    const PARAMS = {
      id: ANSWER_STORE_RELEASE_ID
    };
    retVal = await answerStoreReleasesService.rollbackOne(CONTEXT, PARAMS);
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
  rollbackOne,
}
