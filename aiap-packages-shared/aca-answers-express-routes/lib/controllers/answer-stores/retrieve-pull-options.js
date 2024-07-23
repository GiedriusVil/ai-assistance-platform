/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-answers-express-routes-answer-stores-retrieve-pull-options';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const ramda = require('@ibm-aca/aca-wrapper-ramda');
const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { formatIntoAcaError } = require('@ibm-aca/aca-utils-errors');

const { constructActionContextFromRequest } = require('@ibm-aiap/aiap-utils-express-routes');

const { answerStoresService } = require('@ibm-aca/aca-answers-service');

const retrievePullOptions = async (request, response) => {
  const ERRORS = [];
  let retVal;
  try {
    const ASSISTANT_ID = ramda.path(['query', 'assistantId'], request);
    const ASSISTANT_NAME = ramda.path(['query', 'assistantName'], request);
    const CONTEXT = constructActionContextFromRequest(request);
    const PARAMS = {
      assistant: {
        id: ASSISTANT_ID,
        name: ASSISTANT_NAME
      }
    };
    retVal = await answerStoresService.retrievePullOptions(CONTEXT, PARAMS);
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
  retrievePullOptions,
}
