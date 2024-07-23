/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-utils-soe-messages-send-ai-service-selection-message';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import ramda from '@ibm-aca/aca-wrapper-ramda';
import lodash from '@ibm-aca/aca-wrapper-lodash';

import {
  formatIntoAcaError,
  appendDataToError,
} from '@ibm-aca/aca-utils-errors';

import {
  ISoeUpdateV1,
} from '@ibm-aiap/aiap--types-soe';

import {
  SoeBotV1,
} from '@ibm-aiap/aiap-soe-bot';

import {
  getUpdateGAcaProps,
  getUpdateRawMessageText,
  getUpdateSessionContextClassificationModel,
} from '@ibm-aiap/aiap-utils-soe-update';

import {
  getTenantsCacheProvider,
} from '@ibm-aiap/aiap-tenants-cache-provider';

import {
  getAcaAnswersDatasourceByTenant,
} from '@ibm-aca/aca-answers-datasource-provider';


const sendAiServiceSelectionMessage = async (
  bot: SoeBotV1,
  update: ISoeUpdateV1,
  aiServices: any,
) => {
  let classifierModel;
  let disambiguatedByIntent;
  let attachment;
  try {
    classifierModel = await getUpdateSessionContextClassificationModel(update);
    const UPDATE_MESSAGE_TEXT = getUpdateRawMessageText(update);

    const CHAT_LANGUAGE = update?.raw?.gAcaProps?.isoLang;
    const DEFAULT_MESSAGE = 'Please select a topic you are interested in!';

    const MESSAGE = ramda.pathOr(DEFAULT_MESSAGE, ['ware', 'prompts', 'multiChoiceSuggestion', CHAT_LANGUAGE], classifierModel);

    disambiguatedByIntent = lodash.some(aiServices, 'intents');

    if (
      disambiguatedByIntent
    ) {
      let intents = [];
      const PROMISES = [];
      if (
        !lodash.isEmpty(aiServices)
      ) {
        for (const AI_SERVICE of aiServices) {
          for (const INTENT of AI_SERVICE.intents) {
            PROMISES.push(constructIntentData(update, AI_SERVICE, INTENT));
          }
        }
      }
      const RESULTS = await Promise.all(PROMISES);
      intents = RESULTS.filter(i => i != null);

      attachment = {
        type: 'INTENT_SUGGESTIONS',
        user: {
          text: UPDATE_MESSAGE_TEXT,
        },
        intents: intents,
      };
    } else {
      const MODEL_AI_SERVICES = classifierModel?.aiServices;
      const AI_SERVICES = [];
      if (
        !lodash.isEmpty(aiServices) &&
        !lodash.isEmpty(MODEL_AI_SERVICES)
      ) {
        for (const AI_SERVICE of aiServices) {
          AI_SERVICES.push({
            displayName: getAiServiceDisplayNameByLanguage(AI_SERVICE, MODEL_AI_SERVICES, CHAT_LANGUAGE),
            aiService: {
              id: AI_SERVICE?.aiServiceId,
              aiSkill: {
                id: AI_SERVICE?.aiSkillId,
              }
            }
          });
        }
      }
      attachment = {
        type: 'AI_SERVICE_SUGGESTIONS',
        user: {
          text: UPDATE_MESSAGE_TEXT,
        },
        aiServices: AI_SERVICES,
      };
    }
    const OUTGOING_MESSAGE = bot.createOutgoingMessageFor(update.sender.id);
    OUTGOING_MESSAGE.addText(MESSAGE);
    OUTGOING_MESSAGE.addAttachment(attachment);
    await bot.sendMessage(OUTGOING_MESSAGE);
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, { classifierModel, attachment });
    logger.error(sendAiServiceSelectionMessage.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

const constructIntentData = async (
  update: ISoeUpdateV1,
  aiService: any,
  intent: any,
) => {
  const DISPLAY_NAME = await getIntentDisplayName(update, intent);
  const RET_VAL = {
    displayName: DISPLAY_NAME,
    aiService: {
      id: aiService?.aiServiceId,
      aiSkill: {
        id: aiService?.aiSkillId,
      }
    },
    intent: intent,
  };
  return RET_VAL;
}

const getAiServiceDisplayNameByLanguage = (
  aiSkill: any,
  modelAiServices: any,
  chatLanguage: any,
) => {
  let matchingSkill;
  let displayNameText;
  if (
    !lodash.isEmpty(modelAiServices)
  ) {
    matchingSkill = modelAiServices.find(skill => {
      return skill.skillId === aiSkill.aiSkillId;
    });
  }
  if (
    !lodash.isEmpty(matchingSkill) &&
    !lodash.isEmpty(matchingSkill.displayNameValues)
  ) {
    const DISPLAY_NAME = matchingSkill.displayNameValues.find((displayName: any) => {
      return displayName.language === chatLanguage;
    });
    if (
      !lodash.isEmpty(DISPLAY_NAME)
    ) {
      displayNameText = DISPLAY_NAME.value;
    }
  }
  if (
    !lodash.isEmpty(displayNameText)
  ) {
    return displayNameText;
  }
  return aiSkill?.className;
}

const getIntentDisplayName = async (
  update: ISoeUpdateV1,
  intent: any,
) => {
  try {
    const G_ACA_PROPS = getUpdateGAcaProps(update);
    const G_ACA_PROPS_ASSISTANT_ID = G_ACA_PROPS?.assistantId;
    const TENANTS_CACHE_PROVIDER = getTenantsCacheProvider();
    const TENANT = await TENANTS_CACHE_PROVIDER.tenants.findOneByGAcaProps({ gAcaProps: G_ACA_PROPS });
    const DATASOURCE = getAcaAnswersDatasourceByTenant(TENANT);
    const CHAT_LANGUAGE = G_ACA_PROPS?.isoLang;
    const PARAMS = {
      key: intent.intent,
      assistantId: G_ACA_PROPS_ASSISTANT_ID
    }
    const RET_VAL = await DATASOURCE.answers.findOneByKey({}, PARAMS);
    let retVal = intent?.intent;
    if (
      !lodash.isEmpty(RET_VAL) &&
      !lodash.isEmpty(RET_VAL.values)
    ) {
      for (const VALUE of RET_VAL.values) {
        if (
          VALUE.language === CHAT_LANGUAGE &&
          !lodash.isEmpty(VALUE.output?.intent?.name)
        ) {
          retVal = VALUE.output.intent.name;
        }
      }
    }
    return retVal;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(getIntentDisplayName.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

export {
  sendAiServiceSelectionMessage,
}
