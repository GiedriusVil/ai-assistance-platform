/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-conversations-express-router-conversations-find-transcript-by-conversation-id';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const ramda = require('@ibm-aca/aca-wrapper-ramda');
const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { formatIntoAcaError, throwAcaError, ACA_ERROR_TYPE } = require('@ibm-aca/aca-utils-errors');

const {
  constructActionContextFromRequest,
  constructDefaultFindManyQueryFromRequest,
} = require('@ibm-aiap/aiap-utils-express-routes');
const { transcriptsService } = require('@ibm-aca/aca-conversations-service');

const findOneByConversationId = async (request, response) => {
  const ERRORS = [];
  const CONVERSATION_ID = ramda.path(['params', 'conversationId'], request);
  const SHOW_SYSTEM_MESSAGES = ramda.pathOr(false, ['query', 'system'], request);

  let defaultQuery;

  let context;
  let params;
  let retVal;
  try {
    if (
      lodash.isEmpty(CONVERSATION_ID)
    ) {
      const ERROR_MESSAGE = `Missing required params.conversationId parameter!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, ERROR_MESSAGE);
    }
    defaultQuery = constructDefaultFindManyQueryFromRequest(request);
    context = constructActionContextFromRequest(request);
    params = {
      id: CONVERSATION_ID,
      systemMessages: SHOW_SYSTEM_MESSAGES,
      ...defaultQuery,
    }
    retVal = await transcriptsService.findOneByConversationId(context, params);
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    ERRORS.push(ACA_ERROR);
  }
  if (
    lodash.isEmpty(ERRORS)
  ) {
    response.status(200).json(retVal);
  } else {
    logger.error(MODULE_ID, { errors: ERRORS });
    response.status(500).json(ERRORS);
  }
}

module.exports = {
  findOneByConversationId,
}
