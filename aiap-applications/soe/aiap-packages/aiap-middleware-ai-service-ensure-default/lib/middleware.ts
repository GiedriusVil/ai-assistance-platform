/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = `aiap-middleware-ai-service-ensure-default-ware-middleware`;
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import lodash from '@ibm-aca/aca-wrapper-lodash';

import {
  formatIntoAcaError,
  appendDataToError,
} from '@ibm-aca/aca-utils-errors';

import {
  IContextV1,
} from '@ibm-aiap/aiap--types-server';

import {
  ISoeUpdateV1,
} from '@ibm-aiap/aiap--types-soe';

import {
  SoeBotV1,
} from '@ibm-aiap/aiap-soe-bot';

import {
  sendErrorMessage,
  sendDebugMessage,
} from '@ibm-aiap/aiap-utils-soe-messages';

import {
  shouldSkipBySenderActionTypes,
} from '@ibm-aca/aca-utils-soe-middleware';

import {
  AbstractMiddleware,
  botStates,
  middlewareTypes,
} from '@ibm-aiap/aiap-soe-brain';

import {
  getTenantsCacheProvider,
} from '@ibm-aiap/aiap-tenants-cache-provider';

import {
  getAiServicesDatasourceByTenant,
} from '@ibm-aiap/aiap-ai-services-datasource-provider';

import {
  getUpdateSession,
  getUpdateSessionContext,
} from '@ibm-aiap/aiap-utils-soe-update';

const ON_ERROR_MESSAGE = `[ERROR_MESSAGE] ${MODULE_ID}`;

export class AiServiceEnsureDefaultWare extends AbstractMiddleware {

  constructor() {
    super(
      [
        botStates.NEW,
        botStates.UPDATE
      ],
      'ai-service-ensure-default-ware',
      middlewareTypes.INCOMING
    );
  }

  __shouldSkip(
    context
  ) {
    const PARAMS = {
      update: context?.update,
      skipSenderActionTypes: ['LOG_USER_ACTION'],
    };
    const IGNORE_BY_SENDER_ACTION_TYPE = shouldSkipBySenderActionTypes(PARAMS);
    if (
      IGNORE_BY_SENDER_ACTION_TYPE
    ) {
      return true;
    }
    return false;
  }

  async __retrieveAiService(
    context: IContextV1,
    params: {
      gAcaProps: any,
      aiServiceId: any,
      aiSkillId: any,
    }
  ) {
    let rawAiService;
    let rawAiSkill;
    let retVal;
    try {
      const TENANTS_CACHE_PROVIDER = getTenantsCacheProvider();
      const TENANT = await TENANTS_CACHE_PROVIDER.tenants.findOneByGAcaProps({
        gAcaProps: params?.gAcaProps
      });

      console.log(MODULE_ID, { params });

      const DATASOURCE = await getAiServicesDatasourceByTenant(TENANT);

      const PROMISES: Array<any> = [];
      PROMISES.push(
        DATASOURCE.aiServices.findOneById(context, { id: params?.aiServiceId })
      );
      if (
        !lodash.isEmpty(params?.aiSkillId)
      ) {
        PROMISES.push(
          DATASOURCE.aiSkills.findOneById(context, { id: params?.aiSkillId })
        );
      }

      [rawAiService, rawAiSkill] = await Promise.all(PROMISES);

      console.log(MODULE_ID,
        {
          rawAiService,
          rawAiSkill,
        });

      retVal = {
        id: rawAiService?.id,
        name: rawAiService?.name,
        type: rawAiService?.type,
        external: rawAiService?.external,
      };

      if (
        !lodash.isEmpty(rawAiSkill)
      ) {
        retVal.aiSkill = {
          id: rawAiSkill?.id,
          name: rawAiSkill?.name,
          external: rawAiSkill?.external,
        };
      }

      return retVal;
    } catch (error) {
      const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
      logger.error(this.__retrieveAiService.name, { ACA_ERROR });
      throw ACA_ERROR;
    }
  }

  async executor(
    bot: SoeBotV1,
    update: ISoeUpdateV1,
  ) {
    let updateSession;
    let updateSessionContext;
    let gAcaProps;

    let engagement;
    let engagementSoe;

    let aiServiceId;
    let aiSkillId;

    let aiService;
    try {
      updateSession = getUpdateSession(update);
      aiService = updateSession?.aiService;
      if (
        lodash.isEmpty(aiService)
      ) {
        updateSessionContext = getUpdateSessionContext(update);

        gAcaProps = update?.raw?.gAcaProps;
        engagement = updateSessionContext?.engagement;
        engagementSoe = engagement?.soe;

        aiServiceId = engagementSoe?.aiService?.id;
        aiSkillId = engagementSoe?.aiService?.aiSkill?.id;

        const CONTEXT = {
          user: {
            id: 'SYSTEM_SOE'
          }
        };
        const PARAMS = {
          gAcaProps,
          aiServiceId,
          aiSkillId
        };
        aiService = await this.__retrieveAiService(CONTEXT, PARAMS);
        update.session.aiService = aiService;
      }

      const debugMessage = `[DEBUG_MESSAGE] ${MODULE_ID}`;
      await sendDebugMessage(bot, update,
        {
          MODULE_ID,
          debugMessage,
          aiService,
        });
    } catch (error) {
      const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
      appendDataToError(ACA_ERROR, { gAcaProps });
      logger.error(this.executor.name, { ACA_ERROR });
      await sendErrorMessage(bot, update, ON_ERROR_MESSAGE, ACA_ERROR);
      throw ACA_ERROR;
    }
  }
}
