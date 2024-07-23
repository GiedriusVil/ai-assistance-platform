/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-middleware-classifier-switch-to-ai-service-by-sender-action';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import lodash from '@ibm-aca/aca-wrapper-lodash';

import {
  ACA_ERROR_TYPE,
  formatIntoAcaError,
  throwAcaError,
  appendDataToError,
} from '@ibm-aca/aca-utils-errors';

import {
  ISoeUpdateV1,
} from '@ibm-aiap/aiap--types-soe';

import {
  getUpdateRawMessageSenderAction,
} from '@ibm-aiap/aiap-utils-soe-update';

import {
  switchToAiService,
} from './switch-to-ai-service';


const switchToAiServiceBySenderAction = async (
  update: ISoeUpdateV1,
) => {
  let senderAction;
  let aiService;
  let selectedIntent;
  let params;

  try {
    senderAction = getUpdateRawMessageSenderAction(update);
    aiService = senderAction?.aiService;

    if (
      lodash.isEmpty(update)
    ) {
      const MESSAGE = `Missing required update paramater!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, MESSAGE);
    }
    if (
      lodash.isEmpty(aiService)
    ) {
      const MESSAGE = `Missing required SENDER_ACTION.aiService attribute!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, MESSAGE);
    }

    params = {
      aiService: aiService
    }

    if (
      senderAction?.type === 'INTENT_SELECTED'
    ) {
      selectedIntent = senderAction?.intent;
      params.selectedIntent = selectedIntent;
    }

    await switchToAiService(update, params);
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, { senderAction, aiService, selectedIntent, params });
    logger.error(switchToAiServiceBySenderAction.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

export {
  switchToAiServiceBySenderAction,
}
