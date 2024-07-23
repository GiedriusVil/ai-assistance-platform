/*
  © Copyright IBM Corporation 2023. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-conversations-express-router-conversations-remove-tags';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const lodash = require('@ibm-aca/aca-wrapper-lodash');
const ramda = require('@ibm-aca/aca-wrapper-ramda');

const { formatIntoAcaError } = require('@ibm-aca/aca-utils-errors');

const { constructActionContextFromRequest } = require('@ibm-aiap/aiap-utils-express-routes');
const { conversationsService } = require('@ibm-aca/aca-conversations-service');

const removeTags = async (request, response) => {
  const ERRORS = [];

  const CONVERSATION_ID = ramda.path(['body', 'conversationId'], request);
  if (lodash.isEmpty(CONVERSATION_ID)) {
    ERRORS.push({
      type: 'SYSTEM_ERROR',
      text: 'Missing CONVERSATION_ID!'
    });
  }
  const TAGS = ramda.path(['body', 'tags'], request);

  let retVal;
  try {
    if (lodash.isEmpty(ERRORS)) {
      const CONTEXT = constructActionContextFromRequest(request);
      const PARAMS = {
        id: CONVERSATION_ID,
        tags: TAGS,
      };

      retVal = await conversationsService.removeTags(CONTEXT, PARAMS);
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
    logger.error(`${removeTags.name}`, { errors: ERRORS });
    response.status(500).json(ERRORS);
  }
}

module.exports = {
  removeTags,
}
