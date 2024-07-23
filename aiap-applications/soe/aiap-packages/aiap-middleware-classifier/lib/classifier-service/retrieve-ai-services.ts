/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-middleware-classifier-classifier-service-retrieve-ai-services';
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
  sendErrorMessage,
} from '@ibm-aiap/aiap-utils-soe-messages';

import {
  getUpdateSessionContextClassificationModel,
} from '@ibm-aiap/aiap-utils-soe-update';

import {
  SoeBotV1,
} from '@ibm-aiap/aiap-soe-bot';

import {
  retrieveAiServicesFromClassifier,
} from './retrieve-ai-services-from-classifier';

import {
  hasToForceDisambiguation,
} from './has-to-force-disambiguation';

import {
  applyIntentThreshold,
} from './apply-ai-service-intent-threshold';

import {
  applyAiServiceThreshold,
} from './apply-ai-service-threshold';

import {
  applyClassifierThreshold
} from './apply-classifier-threshold';

const ON_ERROR_MESSAGE = `[ERROR_NOTIFICATION] ${MODULE_ID}`;

const retrieveAiServices = async (
  params: {
    bot: SoeBotV1,
    update: ISoeUpdateV1,
  },
) => {
  let update: ISoeUpdateV1;
  let bot: SoeBotV1;

  let model: IClassificationModelV1;

  let aiServicesByClassifier;

  const debugMessage = `[DEBUG_MESSAGE] ${MODULE_ID}`

  let aiServices: Array<any> = [];
  try {
    bot = params?.bot;
    update = params?.update;

    model = await getUpdateSessionContextClassificationModel(update);

    aiServicesByClassifier = await retrieveAiServicesFromClassifier(update);
    await sendDebugMessage(bot, update,
      {
        MODULE_ID,
        debugMessage,
        aiServicesByClassifier
      });

    if (
      hasToForceDisambiguation(model, aiServicesByClassifier)
    ) {
      // TODO -> LEGO -> We are missing dynamic support of ai-service configuration here!

      const MODEL_DISAMBIGUATION_AI_SKILL_ID = model?.ware?.disambiguation?.aiSkillId;

      // TODO -> LEGO -> Interesting case!!! Need to come back later
      aiServices.push(MODEL_DISAMBIGUATION_AI_SKILL_ID);

    } else {
      aiServices = await applyClassifierThreshold(bot, update, aiServicesByClassifier);
      if (
        !lodash.isEmpty(aiServices)
      ) {
        aiServices = await applyAiServiceThreshold(bot, update, aiServices);
        aiServices = await applyIntentThreshold(bot, update, aiServices);
      }
    }
    return aiServices;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR,
      {
        model,
        aiServicesByClassifier,
      });

    logger.error(retrieveAiServices.name, { ACA_ERROR });
    sendErrorMessage(bot, update, ON_ERROR_MESSAGE, ACA_ERROR);
    throw ACA_ERROR;
  }
}

export {
  retrieveAiServices,
}
