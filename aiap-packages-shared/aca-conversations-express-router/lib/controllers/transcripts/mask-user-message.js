/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-conversations-express-router-transcripts-mask-user-message';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);
const ramda = require('ramda');
const lodash = require('lodash');

const { constructActionContextFromRequest } = require('@ibm-aiap/aiap-utils-express-routes');
const { transcriptsService } = require('@ibm-aca/aca-conversations-service');

const maskUserMessage = async (request, response) => {
  const ERRORS = [];

  const UTTERANCE_ID = ramda.path(['body', 'utteranceId'], request);
  const MESSAGE_ID = ramda.path(['body', 'messageId'], request);
  const MASK_TEMPLATE = ramda.path(['body', 'maskTemplate'], request);

  if (lodash.isEmpty(UTTERANCE_ID)) {
    ERRORS.push({
      type: 'SYSTEM_ERROR',
      text: 'Missing body.utteranceId!'
    });
  }

  if (lodash.isEmpty(MESSAGE_ID)) {
    ERRORS.push({
      type: 'SYSTEM_ERROR',
      text: 'Missing body.messageId!'
    });
  }

  if (lodash.isEmpty(MASK_TEMPLATE)) {
    ERRORS.push({
      type: 'SYSTEM_ERROR',
      text: 'Missing body.maskTemplate!'
    });
  }
  let retVal;
  try {
    if (lodash.isEmpty(ERRORS)) {
      const CONTEXT = constructActionContextFromRequest(request);
      const MASK_USER_MESSAGE_PARAMS = {
        utteranceId: UTTERANCE_ID,
        messageId: MESSAGE_ID,
        maskTemplate: MASK_TEMPLATE
      };
      logger.info('MASK_USER_MESSAGE_PARAMS', { MASK_USER_MESSAGE_PARAMS });
      retVal = await transcriptsService.maskUserMessage(CONTEXT, MASK_USER_MESSAGE_PARAMS);
    }
  } catch (error) {
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
    logger.error('ERRORS', { ERRORS });
    response.status(500).json(ERRORS);
  }
}

module.exports = {
  maskUserMessage,
}
