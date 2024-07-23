/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-middleware-ai-service-action-tags-change-ai-service-action-v2';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import lodash from '@ibm-aca/aca-wrapper-lodash';

import {
  formatIntoAcaError,
  appendDataToError,
  throwAcaError,
  ACA_ERROR_TYPE,
} from '@ibm-aca/aca-utils-errors';

import {
  IAiServiceV1,
  IAiSkillV1,
} from '@ibm-aiap/aiap--types-server';

import {
  ISoeUpdateSessionContextV1,
  ISoeUpdateSessionV1,
  ISoeUpdateV1,
} from '@ibm-aiap/aiap--types-soe';

import {
  sendErrorMessage,
} from '@ibm-aiap/aiap-utils-soe-messages';

import {
  getMemoryStore,
} from '@ibm-aiap/aiap-memory-store-provider';

import {
  getTenantsCacheProvider,
} from '@ibm-aiap/aiap-tenants-cache-provider';

import {
  getAiServicesDatasourceByTenant
} from '@ibm-aiap/aiap-ai-services-datasource-provider';

import {
  getUpdateSessionContext,
  getUpdateSession,
  setUpdateSesion,
} from '@ibm-aiap/aiap-utils-soe-update';

import {
  SoeBotV1,
} from '@ibm-aiap/aiap-soe-bot';

import {
  ISoeActionTagParamsV1,
} from '@ibm-aiap/aiap-soe-action-tag';

const ON_ERROR_MESSAGE = `[ERROR_MESSAGE] ${MODULE_ID}`;

const AiServiceChangeActionV2 = () => ({
  replace: 'all',
  series: true,
  evaluate: 'step',
  controller: async (
    params: ISoeActionTagParamsV1,
  ) => {
    let sessionStore;

    let update: ISoeUpdateV1;
    let bot: SoeBotV1;
    let attributes: any;
    let before: any;

    let updateSession: ISoeUpdateSessionV1;
    let updateSessionContext: ISoeUpdateSessionContextV1;

    let aiService: IAiServiceV1;
    let aiSkill: IAiSkillV1;

    let gAcaProps;
    try {
      sessionStore = getMemoryStore();
      update = params?.update;

      bot = params?.bot;
      attributes = params?.attributes;
      before = params?.before;

      const {
        message,
        aiServiceName,
        aiSkillName,
      } = attributes;

      if (
        before.trim()
      ) {
        bot.reply(update, before);
      }

      updateSession = getUpdateSession(update);
      updateSessionContext = getUpdateSessionContext(update);
      gAcaProps = updateSessionContext?.gAcaProps;

      aiService = updateSession?.aiService;

      const TENANTS_CACHE_PROVIDER = getTenantsCacheProvider();
      const TENANT = await TENANTS_CACHE_PROVIDER.tenants.findOneByGAcaProps({ gAcaProps });
      const DATASOURCE = await getAiServicesDatasourceByTenant(TENANT);

      const CONTEXT = {
        user: {
          id: 'SYSTEM'
        },
      };

      if (
        !lodash.isEmpty(aiServiceName)
      ) {
        aiService = await DATASOURCE.aiServices.findOneByName(
          CONTEXT,
          {
            name: aiServiceName
          }
        );
        if (
          lodash.isEmpty(aiService)
        ) {
          const ERROR_MESSAGE = `Unable to retrieve aiService!`;
          throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, ERROR_MESSAGE);
        }
        updateSession.aiService = aiService;
        setUpdateSesion(update, updateSession);
      }
      if (
        !lodash.isEmpty(aiSkillName)
      ) {
        aiSkill = await DATASOURCE.aiSkills.findOneByAiServiceIdAndName(
          CONTEXT,
          {
            aiServiceId: aiService?.id,
            name: aiSkillName,
          }
        );
        if (
          lodash.isEmpty(aiSkill)
        ) {
          const ERROR_MESSAGE = `Unable to retrieve aiSkill!`;
          throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, ERROR_MESSAGE);
        }
        aiService.aiSkill = aiSkill;
      }
      await sessionStore.setData(update.sender.id, update.session);

      const MESSAGE = {
        text: message,
      };

      bot.sendUpdateByIncomingMessage(update, MESSAGE, updateSessionContext);

    } catch (error) {
      const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
      appendDataToError(ACA_ERROR, { attributes })
      logger.error(AiServiceChangeActionV2.name, { ACA_ERROR });
      await sendErrorMessage(bot, update, ON_ERROR_MESSAGE, ACA_ERROR);
      throw ACA_ERROR;
    }
  },
});

export {
  AiServiceChangeActionV2,
}
