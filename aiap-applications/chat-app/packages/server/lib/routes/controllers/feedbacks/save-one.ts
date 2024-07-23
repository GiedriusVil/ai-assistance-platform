/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'vba-chat-app-controllers-feedbacks-save-one';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import lodash from '@ibm-aca/aca-wrapper-lodash';

import {
  formatIntoAcaError,
  ACA_ERROR_TYPE,
  throwAcaError
} from '@ibm-aca/aca-utils-errors';

import {
  addAttachmentToTranscript
} from '@ibm-aca/aca-utils-transcript';

import {
  feedbacksService
} from '../../../services';

const { getTokenService } = require('@ibm-aiap/aiap-token-service');

const attachmentParams = feedback => {
  return {
    MESSAGE_ID: feedback.messageId,
    SESSION: {
      conversation: {
        id: feedback.conversationId,
      },
      user: {
        id: feedback.userId,
      }
    },
    ATTACHMENT: {
      type: 'feedback',
      attachments: [feedback],
    },
  };
};

const saveOne = async (request, response) => {
  const ERRORS = [];

  let requestBody;
  let token;
  let tokenContent;
  let gAcaProps;
  let feedback;

  let conversationId;
  let userId;

  try {
    requestBody = request?.body;
    token = requestBody?.token;
    gAcaProps = requestBody?.gAcaProps;
    feedback = requestBody?.feedback;

    if (
      lodash.isEmpty(token)
    ) {
      const ERROR_MESSAGE = `Missing required request.body.token parameter!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, ERROR_MESSAGE);
    }
    if (
      lodash.isEmpty(gAcaProps)
    ) {
      const ERROR_MESSAGE = `Missing required request.body.gAcaProps parameter!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, ERROR_MESSAGE);
    }
    if (
      lodash.isEmpty(feedback)
    ) {
      const ERROR_MESSAGE = `Missing required request.body.feedback parameter!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, ERROR_MESSAGE);
    }
    const TOKEN_SERVICE = getTokenService();
    tokenContent = TOKEN_SERVICE.verify(token);
    if (
      lodash.isEmpty(tokenContent)
    ) {
      const ERROR_MESSAGE = `Invalid required request.body.token paramater!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, ERROR_MESSAGE);
    }
    conversationId = tokenContent?.conversation?.id;
    if (
      lodash.isEmpty(conversationId)
    ) {
      const ERROR_MESSAGE = `Invalid decoded token value request.body.token.conversationId paramater!`
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, ERROR_MESSAGE);
    }
    userId = tokenContent?.user?.id;
    if (
      !lodash.isEmpty(userId)
    ) {
      feedback.userId = userId;
    }
    feedback.conversationId = conversationId;
    const CONTEXT = { gAcaProps };
    const PARAMS = { feedback };
    await feedbacksService.saveOne(CONTEXT, PARAMS);
    const { SESSION, MESSAGE_ID, ATTACHMENT } = attachmentParams(feedback);
    await addAttachmentToTranscript(SESSION, MESSAGE_ID, ATTACHMENT);
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(saveOne.name, { ACA_ERROR });
    ERRORS.push(ACA_ERROR);
  }
  if (
    lodash.isEmpty(ERRORS)
  ) {
    response.status(200).json({});
  } else {
    logger.error(saveOne.name, { ERRORS });
    response.status(500).json(ERRORS);
  }
};

export {
  saveOne,
};
