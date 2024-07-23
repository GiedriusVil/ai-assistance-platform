/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-conversations-express-router-conversations-add-review';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const lodash = require('@ibm-aca/aca-wrapper-lodash');
const ramda = require('@ibm-aca/aca-wrapper-ramda');

const { formatIntoAcaError } = require('@ibm-aca/aca-utils-errors');

const { constructActionContextFromRequest } = require('@ibm-aiap/aiap-utils-express-routes');
const { conversationsService } = require('@ibm-aca/aca-conversations-service');


const addReview = async (request, response) => {
  const ERRORS = [];

  const CONVERSATION_ID = ramda.path(['body', 'conversationId'], request);
  if (lodash.isEmpty(CONVERSATION_ID)) {
    ERRORS.push({
      type: 'SYSTEM_ERROR',
      text: 'Missing CONVERSATION_ID!'
    });
  }
  const REVIEWED = ramda.path(['body', 'reviewed'], request);

  let retVal;
  try {
    if (lodash.isEmpty(ERRORS)) {

      const CONTEXT = constructActionContextFromRequest(request);
      const PARAMS = {
        id: CONVERSATION_ID,
        reviewed: REVIEWED,
      };
      logger.info('->', {
        PARAMS
      });

      retVal = await conversationsService.addReview(CONTEXT, PARAMS);
    }
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    ERRORS.push(ACA_ERROR);
  }
  if (
    lodash.isEmpty(ERRORS)
  ) {
    response.status(200).json(retVal);
  } else {
    logger.error(`${addReview.name}`, { errors: ERRORS });
    response.status(500).json(ERRORS);
  }
}

module.exports = {
  addReview,
}
