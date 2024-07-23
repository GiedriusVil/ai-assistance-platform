/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'vba-chat-app-controllers-surveys-save-one';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import lodash from '@ibm-aca/aca-wrapper-lodash';

const { getTokenService } = require('@ibm-aiap/aiap-token-service');

import {
  throwAcaError,
  ACA_ERROR_TYPE,
  formatIntoAcaError
} from '@ibm-aca/aca-utils-errors';

import {
  surveyService
} from '../../../services';

const saveOne = async (request, response) => {
  const ERRORS = [];

  let requestBody;

  let token;
  let tokenContent;
  let gAcaProps;
  let survey;

  let conversationId;
  let userId;
  try {
    requestBody = request?.body;

    token = requestBody?.token;

    gAcaProps = requestBody?.gAcaProps;
    survey = requestBody?.survey;

    if (
      lodash.isEmpty(token)
    ) {
      const ERROR_MESSAGE = `Missing required request.body.token parameter!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, ERROR_MESSAGE);
    }
    const TOKEN_SERVICE = getTokenService();
    tokenContent = TOKEN_SERVICE.verify(token);
    if (
      lodash.isEmpty(tokenContent)
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
      lodash.isEmpty(survey)
    ) {
      const ERROR_MESSAGE = `Missing required request.body.survey parameter!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, ERROR_MESSAGE);
    }
    conversationId = tokenContent?.conversation?.id;
    if (
      lodash.isEmpty(conversationId)
    ) {
      const ERROR_MESSAGE = `Invalid decoded token value request.body.token.conversationId paramater!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, ERROR_MESSAGE);
    }
    userId = tokenContent?.user?.id;
    if (
      !lodash.isEmpty(userId)
    ) {
      survey.userId = userId;
    }
    survey.conversationId = conversationId;
    if (
      lodash.isEmpty(ERRORS)
    ) {
      const CONTEXT = { gAcaProps };
      const PARAMS = { survey };
      await surveyService.saveOne(CONTEXT, PARAMS);
    }
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    ERRORS.push(ACA_ERROR);
  }
  if (lodash.isEmpty(ERRORS)) {
    response.status(200).json({});
  } else {
    logger.error('ERRORS', { ERRORS });
    response.status(500).json(ERRORS);
  }
};

export {
  saveOne,
};
