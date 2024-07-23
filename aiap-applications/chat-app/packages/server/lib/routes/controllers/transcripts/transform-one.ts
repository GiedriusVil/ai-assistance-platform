/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-chat-app-controllers-transcripts-transform-one';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import lodash from '@ibm-aca/aca-wrapper-lodash';

import {
  formatIntoAcaError
} from '@ibm-aca/aca-utils-errors';

import {
  transcriptsService
} from '../../../services';

const transformOne = async (request, response) => {
  const ERRORS = [];
  try {
    const REQUEST_BODY = request?.body;
    const G_ACA_PROPS = REQUEST_BODY?.gAcaProps;
    const TRANSCRIPTS = REQUEST_BODY?.transcripts;
    const TEST_CASE = REQUEST_BODY?.testCase;
    const USERNAME = REQUEST_BODY?.username;
    if (lodash.isEmpty(REQUEST_BODY)) {
      const ACA_ERROR = {
        type: 'VALIDATION_ERROR',
        message: `[${MODULE_ID}] Missing required request.body paramater!`,
      };
      ERRORS.push(ACA_ERROR);
    }
    if (lodash.isEmpty(G_ACA_PROPS)) {
      const ACA_ERROR = {
        type: 'VALIDATION_ERROR',
        message: `[${MODULE_ID}] Missing required request.body.gAcaProps paramater!`,
      };
      ERRORS.push(ACA_ERROR);
    }
    if (lodash.isEmpty(TRANSCRIPTS)) {
      const ACA_ERROR = {
        type: 'VALIDATION_ERROR',
        message: `[${MODULE_ID}] Missing required request.body.transcripts paramater!`,
      };
      ERRORS.push(ACA_ERROR);
    }
    if (lodash.isEmpty(TEST_CASE)) {
      const ACA_ERROR = {
        type: 'VALIDATION_ERROR',
        message: `[${MODULE_ID}] Missing required request.body.testCase paramater!`,
      };
      ERRORS.push(ACA_ERROR);
    }
    if (lodash.isEmpty(USERNAME)) {
      const ACA_ERROR = {
        type: 'VALIDATION_ERROR',
        message: `[${MODULE_ID}] Missing required request.body.username paramater!`,
      };
      ERRORS.push(ACA_ERROR);
    }
    if (lodash.isEmpty(ERRORS)) {
      const CONTEXT = {
        gAcaProps: G_ACA_PROPS,
      };
      const PARAMS = REQUEST_BODY;
      await transcriptsService.transformOne(CONTEXT, PARAMS);
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
  transformOne,
};
