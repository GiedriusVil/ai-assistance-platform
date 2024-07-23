/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-middleware-classifier-switch-to-ai-service-by-regex';
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
  sendDebugMessage,
} from '@ibm-aiap/aiap-utils-soe-messages';

import {
  getUpdateSenderId,
  getUpdateSessionContextClassificationModel,
} from '@ibm-aiap/aiap-utils-soe-update';

import {
  SoeBotV1,
} from '@ibm-aiap/aiap-soe-bot';

import {
  switchToAiService,
} from './switch-to-ai-service';

const switchToAiServiceByRegex = async (
  bot: SoeBotV1,
  update: ISoeUpdateV1,
) => {

  let updateSenderId;
  let updateRawMessageText;

  let updateClassifierModel;
  let updateClassifierModelAiServices;

  let aiServiceSwitchTo;

  let isRegexValid = false;
  try {
    if (
      lodash.isEmpty(update)
    ) {
      const MESSAGE = `Missing required update paramater!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, MESSAGE);
    }
    updateSenderId = getUpdateSenderId(update);
    updateRawMessageText = update?.raw?.message?.text;

    updateClassifierModel = await getUpdateSessionContextClassificationModel(update);
    updateClassifierModelAiServices = updateClassifierModel?.aiServices;

    if (
      !lodash.isEmpty(updateRawMessageText) &&
      !lodash.isEmpty(updateClassifierModelAiServices) &&
      lodash.isArray(updateClassifierModelAiServices)
    ) {
      for (const TMP_AI_SERVICE of updateClassifierModelAiServices) {
        const TMP_REGEX_STRING = TMP_AI_SERVICE?.regex;

        let tmpRegexExp;
        if (
          !lodash.isEmpty(TMP_REGEX_STRING)
        ) {
          try {
            tmpRegexExp = new RegExp(TMP_REGEX_STRING);
            isRegexValid = tmpRegexExp.test(updateRawMessageText);
          } catch (error) {
            //
          }
        }
        if (
          isRegexValid
        ) {
          aiServiceSwitchTo = {
            id: TMP_AI_SERVICE?.serviceId,
            aiSkill: {
              id: TMP_AI_SERVICE?.skillId,
            }
          };
          await switchToAiService(update,
            {
              aiService: aiServiceSwitchTo,
            });

          await sendDebugMessage(bot, update,
            {
              MODULE_ID,
              aiServiceSwitchTo,
            });

          break;
        }
      }
    }
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, { updateSenderId, updateRawMessageText, isRegexValid });
    logger.error(switchToAiServiceByRegex.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

export {
  switchToAiServiceByRegex,
}
