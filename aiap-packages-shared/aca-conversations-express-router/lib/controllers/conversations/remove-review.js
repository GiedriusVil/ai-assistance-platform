/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-conversations-express-router-conversations-remove-review';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);
const lodash = require('@ibm-aca/aca-wrapper-lodash');
const ramda = require('@ibm-aca/aca-wrapper-ramda');

const { constructActionContextFromRequest } = require('@ibm-aiap/aiap-utils-express-routes');
const { conversationsService } = require('@ibm-aca/aca-conversations-service');

const removeReview = async (request, response) => {
  const ERRORS = [];
  const CONVERSATION_ID = ramda.path(['body', 'conversationId'], request);
  if (lodash.isEmpty(CONVERSATION_ID)) {
    ERRORS.push({
      type: 'SYSTEM_ERROR',
      text: 'Missing CONVERSATION_ID!'
    });
  }
  let retVal;
  try {
    if (lodash.isEmpty(ERRORS)) {

      const CONTEXT = constructActionContextFromRequest(request);
      const PARAMS = {
        id: CONVERSATION_ID,
      };
      logger.info('->', {
        PARAMS
      });

      retVal = await conversationsService.removeReview(CONTEXT, PARAMS);
    }
  } catch (error) {
    logger.error('COUGHT_SYSTEM_ERROR', {
      error: {
        text: `${error}`,
        json: error,
      }
    });
    ERRORS.push({
      type: 'SYSTEM_ERROR',
      text: `${error}`,
      json: error
    });
  }
  if (
    lodash.isEmpty(ERRORS)
  ) {
    response.status(200).json(retVal);
  } else {
    response.status(500).json(ERRORS);
  }
}

module.exports = {
  removeReview,
} 
