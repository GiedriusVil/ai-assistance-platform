/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-middleware-ai-service-action-tags-change-ai-service-action';
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
  getAiServicesDatasourceByTenant,
} from '@ibm-aiap/aiap-ai-services-datasource-provider';

import {
  getUpdateSessionContext,
  getUpdateSession,
} from '@ibm-aiap/aiap-utils-soe-update';

import {
  SoeBotV1,
} from '@ibm-aiap/aiap-soe-bot';

import {
  ISoeActionTagParamsV1,
} from '@ibm-aiap/aiap-soe-action-tag';

const ON_ERROR_MESSAGE = `[ERROR_MESSAGE] ${MODULE_ID}`;

export const AiServiceChangeAction = () => ({
  replace: 'all',
  series: true,
  evaluate: 'step',
  controller: async (
    params: ISoeActionTagParamsV1,
  ) => {
    let sessionStore;

    let update: ISoeUpdateV1;
    let bot: SoeBotV1;
    let attributes;
    let before;

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
        name,
      } = attributes;

      if (before.trim()) bot.reply(update, before);

      updateSession = getUpdateSession(update);
      updateSessionContext = getUpdateSessionContext(update);
      gAcaProps = updateSessionContext?.gAcaProps;

      aiService = updateSession?.aiService;

      const TENANTS_CACHE_PROVIDER = getTenantsCacheProvider();
      const TENANT = await TENANTS_CACHE_PROVIDER.tenants.findOneByGAcaProps({ gAcaProps });
      const DATASOURCE = await getAiServicesDatasourceByTenant(TENANT);

      const CONTEXT = { user: { id: 'SYSTEM' } };

      const PARAMS = {
        aiServiceId: aiService?.id,
        name: name,
      };

      aiSkill = await DATASOURCE.aiSkills.findOneByAiServiceIdAndName(CONTEXT, PARAMS);

      console.log(MODULE_ID,
        {
          PARAMS,
          aiSkill,
        });

      if (
        lodash.isEmpty(aiSkill)
      ) {
        const ERROR_MESSAGE = `Unable to retrieve aiSkill!`;
        throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, ERROR_MESSAGE);
      }

      aiService.aiSkill = aiSkill;

      const MESSAGE = {
        text: message,
      };

      await sessionStore.setData(update.sender.id, update.session);
      bot.sendUpdateByIncomingMessage(update, MESSAGE, updateSessionContext);
    } catch (error) {
      const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
      appendDataToError(ACA_ERROR, { attributes })
      logger.error(AiServiceChangeAction.name, { ACA_ERROR });
      await sendErrorMessage(bot, update, ON_ERROR_MESSAGE, ACA_ERROR)
      throw ACA_ERROR;
    }
  },
});
