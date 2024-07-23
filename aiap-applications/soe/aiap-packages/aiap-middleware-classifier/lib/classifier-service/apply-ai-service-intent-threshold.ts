/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-middleware-classifier-classifier-service-apply-ai-service-intent-threshold';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import lodash from '@ibm-aca/aca-wrapper-lodash';

import {
  formatIntoAcaError,
  appendDataToError,
} from '@ibm-aca/aca-utils-errors';

import {
  IAiServiceV1,
  IClassificationModelV1,
} from '@ibm-aiap/aiap--types-server';

import {
  ISoeUpdateV1,
} from '@ibm-aiap/aiap--types-soe';

import {
  sendDebugMessage,
} from '@ibm-aiap/aiap-utils-soe-messages';

import {
  getUpdateSessionContextClassificationModel,
} from '@ibm-aiap/aiap-utils-soe-update';

import {
  SoeBotV1,
} from '@ibm-aiap/aiap-soe-bot';

const _filterIntentsByThreshold = (
  model: IClassificationModelV1,
  params: {
    intents: Array<{
      confidence: any
    }>
  },
) => {
  let modelThresholdIntent;

  let intentThresholdTop;
  let intentThresholdRange;
  let intentThresholdMin;
  let intentThresholdQuantity;

  let paramsIntents;

  let retVal;

  try {
    modelThresholdIntent = model?.ware?.threshold?.intent;

    intentThresholdTop = modelThresholdIntent?.top;
    intentThresholdRange = modelThresholdIntent?.range;
    intentThresholdMin = modelThresholdIntent?.min;
    intentThresholdQuantity = modelThresholdIntent?.quantity;

    paramsIntents = params?.intents;

    retVal = [];

    paramsIntents = paramsIntents.filter(intent => lodash.isNumber(intent.confidence));

    const INTENT_TOP = paramsIntents[0];
    if (
      INTENT_TOP &&
      INTENT_TOP.confidence <= intentThresholdTop
    ) {
      return retVal;
    }
    retVal.push(INTENT_TOP);
    paramsIntents.slice(1, intentThresholdQuantity).forEach((intent) => {
      if (
        (INTENT_TOP.confidence - intent.confidence) < intentThresholdRange &&
        intent.confidence >= intentThresholdMin
      ) {
        retVal.push(intent);
      }
    });
    return retVal;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, { modelThresholdIntent, paramsIntents, retVal });
    logger.error(_filterIntentsByThreshold.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

export const applyIntentThreshold = async (
  bot: SoeBotV1,
  update: ISoeUpdateV1,
  aiServices: Array<IAiServiceV1>,
) => {
  let debugMessage;

  let model: IClassificationModelV1;
  let modelThresholdIntent;

  let intentThresholdTop;
  let intentThresholdRange;
  let intentThresholdMin;
  let intentThresholdQuantity;

  let retVal;

  try {
    model = await getUpdateSessionContextClassificationModel(update);

    modelThresholdIntent = model?.ware?.threshold?.intent;
    intentThresholdTop = modelThresholdIntent?.top;
    intentThresholdRange = modelThresholdIntent?.range;
    intentThresholdMin = modelThresholdIntent?.min;
    intentThresholdQuantity = modelThresholdIntent?.quantity;

    if (
      !lodash.isEmpty(aiServices) &&
      lodash.isArray(aiServices) &&
      lodash.isNumber(intentThresholdTop) &&
      lodash.isNumber(intentThresholdRange) &&
      lodash.isNumber(intentThresholdMin) &&
      intentThresholdQuantity > 0
    ) {
      aiServices.forEach(aiService => {

        const AI_SERVICE_INTENTS = aiService?.intents;

        if (lodash.isEmpty(AI_SERVICE_INTENTS)) {
          return;
        }
        aiService.intents = _filterIntentsByThreshold(model, { intents: AI_SERVICE_INTENTS });
      });
      retVal = aiServices.filter(aiService => !lodash.isEmpty(aiService?.intents));
    } else {
      retVal = aiServices;
    }

    debugMessage = `[DEBUG_MESSAGE] ${MODULE_ID}!`;
    await sendDebugMessage(bot, update,
      {
        MODULE_ID,
        debugMessage,
        aiServices,
        retVal,
      });

    return retVal;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, { modelThresholdIntent, retVal });
    logger.error(applyIntentThreshold.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}
