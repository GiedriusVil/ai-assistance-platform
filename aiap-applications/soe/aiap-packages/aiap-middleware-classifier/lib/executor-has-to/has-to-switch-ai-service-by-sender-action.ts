/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-middleware-classifier-has-to-switch-ai-service-by-sender-action';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import lodash from '@ibm-aca/aca-wrapper-lodash';

import {
  formatIntoAcaError,
  throwAcaError,
  ACA_ERROR_TYPE,
  appendDataToError,
} from '@ibm-aca/aca-utils-errors';

import {
  ISoeUpdateV1,
} from '@ibm-aiap/aiap--types-soe';

import {
  getUpdateRawMessageSenderAction,
} from '@ibm-aiap/aiap-utils-soe-update';

const hasToSwitchAiServiceBySenderAction = (
  update: ISoeUpdateV1,
) => {
  let senderAction;
  let senderActionAiService;
  let senderActionType;
  let senderActionIntent;

  let aiServiceId;
  let aiSkillId;

  try {
    if (
      lodash.isEmpty(update)
    ) {
      const MESSAGE = 'Missing required update paramater!';
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }
    senderAction = getUpdateRawMessageSenderAction(update);

    senderActionType = senderAction?.type;
    senderActionAiService = senderAction?.aiService;
    senderActionIntent = senderAction?.intent;

    aiServiceId = senderActionAiService?.id;
    aiSkillId = senderActionAiService?.aiSkill?.id;

    let retVal = false;

    switch (senderActionType) {
      case 'AI_SERVICE_SELECTED':
        if (
          !lodash.isEmpty(aiServiceId) &&
          !lodash.isEmpty(aiSkillId)
        ) {
          retVal = true;
        }
        break;
      case 'INTENT_SELECTED':
        if (
          !lodash.isEmpty(aiServiceId) &&
          !lodash.isEmpty(aiSkillId) &&
          !lodash.isEmpty(senderActionIntent)
        ) {
          retVal = true;
        }
        break;
    }
    return retVal;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, { senderAction });
    logger.error(hasToSwitchAiServiceBySenderAction.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

export {
  hasToSwitchAiServiceBySenderAction,
}
