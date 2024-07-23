/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-middleware-classifier-incoming-ware';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import ramda from '@ibm-aca/aca-wrapper-ramda';
import lodash from '@ibm-aca/aca-wrapper-lodash';

import {
  formatIntoAcaError,
  appendDataToError,
  throwAcaError,
  ACA_ERROR_TYPE,
} from '@ibm-aca/aca-utils-errors';

import {
  ISoeUpdateV1,
} from '@ibm-aiap/aiap--types-soe';

import {
  shouldSkipBySenderActionTypes,
} from '@ibm-aca/aca-utils-soe-middleware';

import {
  AbstractMiddleware,
  botStates,
  middlewareTypes,
} from '@ibm-aiap/aiap-soe-brain';

import {
  sendAiServiceSelectionMessage,
  sendDebugMessage,
  sendErrorMessage,
} from '@ibm-aiap/aiap-utils-soe-messages';

import {
  executeEnrichedByLambdaModule,
} from '@ibm-aca/aca-lambda-modules-executor';

import {
  getUpdateSessionContextAttribute,
  setUpdateSessionContextAttribute,
  getUpdateSessionContextClassificationModel,
  getUpdateSessionContext,
} from '@ibm-aiap/aiap-utils-soe-update';

import {
  SoeBotV1,
} from '@ibm-aiap/aiap-soe-bot';

import {
  getTenantsCacheProvider,
} from '@ibm-aiap/aiap-tenants-cache-provider';

import * as classifierService from '../classifier-service';

import {
  hasToClassifyInputText,
  hasToSwitchAiServiceByRegex,
  hasToSwitchAiServiceBySenderAction,
} from '../executor-has-to';

import {
  switchToAiServiceByRegex,
  switchToAiServiceBySenderAction,
  switchToAiService,
} from '../executor-switch-to';

const ON_ERROR_MESSAGE = `[ERROR_NOTIFICATION] ${MODULE_ID}`;

const _executorAsyncDefault = async (
  context,
  params: {
    bot: SoeBotV1,
    update: ISoeUpdateV1,
  },
) => {
  let bot: SoeBotV1;
  let update: ISoeUpdateV1;

  let updateSessionContext;
  let updateRequestMessage;

  let debugMessage;

  let engagementSoe;
  let engagementSoeClassifierModelId;

  let classifierModel;
  let _hasToSwitchAiServiceBySenderAction;
  let _hasToClassifyInputText;
  let _hasToSwitchAiServiceByRegex;

  let disambiguatedByIntent;

  let aiServices;
  let aiServiceSwitchTo;
  try {
    bot = params?.bot;
    update = params?.update;


    updateRequestMessage = update?.request?.message;
    updateSessionContext = getUpdateSessionContext(update);
    engagementSoe = updateSessionContext?.engagement?.soe;
    engagementSoeClassifierModelId = engagementSoe?.classifier?.model?.id;
    if (
      lodash.isEmpty(engagementSoeClassifierModelId)
    ) {
      return;
    }
    classifierModel = await getUpdateSessionContextClassificationModel(update);

    if (
      lodash.isEmpty(classifierModel)
    ) {
      const MESSAGE = 'Unable to retrieve configured classifier model!';
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, MESSAGE);
    }
    _hasToSwitchAiServiceBySenderAction = hasToSwitchAiServiceBySenderAction(update);
    _hasToClassifyInputText = await hasToClassifyInputText(update);
    _hasToSwitchAiServiceByRegex = await hasToSwitchAiServiceByRegex(update);

    debugMessage = `[DEBUG_MESSAGE] ${MODULE_ID}`;
    await sendDebugMessage(bot, update,
      {
        MODULE_ID,
        debugMessage,
        _hasToSwitchAiServiceBySenderAction,
        _hasToClassifyInputText,
        _hasToSwitchAiServiceByRegex,
      });

    if (
      _hasToSwitchAiServiceBySenderAction
    ) {
      await switchToAiServiceBySenderAction(update);
      return;
    }
    if (!_hasToClassifyInputText) {
      return;
    }
    if (
      _hasToSwitchAiServiceByRegex
    ) {
      await switchToAiServiceByRegex(bot, update);
      return;
    }
    aiServices = await classifierService.retrieveAiServices({
      bot,
      update,
    });

    setUpdateSessionContextAttribute(update, 'classifier-result', aiServices);
    disambiguatedByIntent = lodash.some(aiServices, 'intents');
    if (
      aiServices.length === 0
    ) {
      aiServiceSwitchTo = {
        id: classifierModel?.fallbackAiService?.serviceId,
        aiSkill: {
          id: classifierModel?.fallbackAiService?.aiSkillId,
        },
      };
    } else if (
      aiServices.length === 1 &&
      (
        !disambiguatedByIntent ||
        aiServices[0]?.intents?.length === 1
      )
    ) {
      aiServiceSwitchTo = aiServices[0];
      aiServiceSwitchTo = {
        id: aiServiceSwitchTo?.aiServiceId,
        aiSkill: {
          id: aiServiceSwitchTo?.aiSkillId,
        },
      };
    } else if (
      aiServices.length > 1 ||
      disambiguatedByIntent
    ) {
      const ON_MULTIPLE_CHOICES = classifierModel?.ware?.onMultipleChoices;

      switch (ON_MULTIPLE_CHOICES) {
        case 'SUGGEST':
          await sendAiServiceSelectionMessage(bot, update, aiServices);
          return 'cancel';
        default:
          aiServiceSwitchTo = ramda.path([0], aiServices);
          aiServiceSwitchTo = {
            id: aiServiceSwitchTo?.aiServiceId,
            aiSkill: {
              id: aiServiceSwitchTo?.aiSkillId,
            },
          };
          break;
      }
    }
    await sendDebugMessage(bot, update, {
      MODULE_ID,
      debugMessage,
      aiServices,
      classifierModel,
      disambiguatedByIntent,
      updateRequestMessage,
      aiServiceSwitchTo,
    });

    if (
      !lodash.isEmpty(aiServiceSwitchTo)
    ) {
      await switchToAiService(update, { aiService: aiServiceSwitchTo });
    }
    return;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(_executorAsyncDefault.name, { ACA_ERROR });
    appendDataToError(ACA_ERROR, {
      engagementSoeClassifierModelId,
      classifierModel,
      aiServices,
      aiServiceSwitchTo,
      _hasToSwitchAiServiceBySenderAction,
      _hasToClassifyInputText,
      _hasToSwitchAiServiceByRegex,
      disambiguatedByIntent,
    });
    throw ACA_ERROR;
  }
};



class ClassifierIncomingWare extends AbstractMiddleware {

  constructor() {
    super(
      [
        botStates.NEW,
        botStates.UPDATE,
        botStates.INTERNAL_UPDATE
      ],
      'classifier-ware-inc',
      middlewareTypes.INCOMING
    );
  }


  __shouldSkip(context) {
    const PARAMS = {
      update: context?.update,
      skipSenderActionTypes: ['LOG_USER_ACTION'],
    };

    const IGNORE_BY_SENDER_ACTION_TYPE = shouldSkipBySenderActionTypes(PARAMS);

    if (IGNORE_BY_SENDER_ACTION_TYPE) {
      return true;
    }

    return false;
  }

  async executor(
    bot: SoeBotV1,
    update: ISoeUpdateV1,
  ) {
    let gAcaProps;
    let tenantCacheProvider;
    let tenant;
    let tenantId;
    let tenantHash;
    try {
      gAcaProps = getUpdateSessionContextAttribute(update, 'gAcaProps');
      if (
        lodash.isEmpty(gAcaProps)
      ) {
        const MESSAGE = 'Unable to retrieve gAcaProps from update!';
        throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, MESSAGE);
      }

      tenantCacheProvider = getTenantsCacheProvider();
      tenant = await tenantCacheProvider.tenants.findOneByGAcaProps({
        gAcaProps,
      });
      tenantId = tenant?.id;
      tenantHash = tenant?.hash;
      if (lodash.isEmpty(tenant)) {
        const MESSAGE = 'Unable to retrieve tenant from tenantCacheProvider!';
        throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, MESSAGE);
      }
      const PARAMS = {
        bot,
        update,
        tenant,
      };

      const CONTEXT = {
        user: {
          session: { tenant },
        },
      };
      return await executeEnrichedByLambdaModule(
        MODULE_ID,
        _executorAsyncDefault,
        CONTEXT,
        PARAMS
      );
    } catch (error) {
      const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
      logger.error(this.executor.name, { ACA_ERROR });
      appendDataToError(ACA_ERROR, { tenantId, tenantHash });
      setUpdateSessionContextAttribute(update, 'classifier-error', ACA_ERROR);
      sendErrorMessage(bot, update, ON_ERROR_MESSAGE, ACA_ERROR);
      return 'cancel';
    }
  }
}

export {
  ClassifierIncomingWare,
}
