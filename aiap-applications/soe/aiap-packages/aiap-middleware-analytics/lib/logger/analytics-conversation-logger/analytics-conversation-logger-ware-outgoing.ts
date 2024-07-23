/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-midleware-analytics-analytics-conversation-logger-ware-outgoing';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import ramda from '@ibm-aca/aca-wrapper-ramda';
import lodash from '@ibm-aca/aca-wrapper-lodash';

import {
  ISoeUpdateV1,
} from '@ibm-aiap/aiap--types-soe';

import {
  SoeBotV1,
} from '@ibm-aiap/aiap-soe-bot';

import {
  ACA_ERROR_TYPE,
  throwAcaError,
  formatIntoAcaError,
} from '@ibm-aca/aca-utils-errors';

import {
  shouldSkipBySenderActionTypes,
  enrichedByLambdaModuleAsyncExecutor,
} from '@ibm-aca/aca-utils-soe-middleware';

import {
  getTenantsCacheProvider,
} from '@ibm-aiap/aiap-tenants-cache-provider';

import {
  getAcaConversationsDatasourceByTenant,
} from '@ibm-aca/aca-conversations-datasource-provider';

import {
  getConvShadowDatasourceByTenant,
} from '@ibm-aiap/aiap-conv-shadow-datasource-provider';

import {
  botStates,
  middlewareTypes,
} from '@ibm-aiap/aiap-soe-brain';

import {
  AnalyticsConversationLoggerWare
} from './analytics-conversation-logger-ware';

export class AnalyticsConversationLoggerWareOutgoing extends AnalyticsConversationLoggerWare {

  constructor(
    configuration: any,
  ) {
    super(
      [
        botStates.UPDATE,
        botStates.INTERNAL_UPDATE,
      ],
      'analytics-conversation-logger-outgoing',
      middlewareTypes.OUTGOING,
      configuration
    );
  }

  __shouldSkip(context) {
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

  hasErrorMessages(
    message: any,
  ) {
    let retVal = false;
    const ERRORS = ramda.pathOr([], ['errors'], message);
    if (
      lodash.isArray(ERRORS) &&
      !lodash.isEmpty(ERRORS)
    ) {
      retVal = true;
    }
    return retVal;
  }

  formRecord(
    update: ISoeUpdateV1,
    message: any,
  ) {
    const RET_VAL: any = {
      conversation: {
        id: this.getConversationId(update),
        end: this.getEnd(),
        hasUserInteraction: this.hasUserInteraction(update),
        channelMeta: this.getChannelMeta(update)
      },
    };
    if (
      this.hasErrorMessages(message)
    ) {
      RET_VAL.conversation.hasErrorMessages = true;
    }
    return RET_VAL;
  }

  async defaultExecutor(
    context: any,
    params: {
      update: ISoeUpdateV1,
      message: any,
    },
  ) {
    try {
      const UPDATE = params?.update;
      const G_ACA_PROPS = UPDATE.raw?.gAcaProps;
      if (
        lodash.isEmpty(UPDATE)
      ) {
        {
          const MESSAGE = 'Missing required params.update parameter!';
          throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, MESSAGE, {
            gAcaProps: G_ACA_PROPS,
          });
        }
      }
      if (
        UPDATE.skipConversationLogger
      ) {
        return;
      }
      const TENANTS_CACHE_PROVIDER = getTenantsCacheProvider();
      const TENANT = await TENANTS_CACHE_PROVIDER.tenants.findOneByGAcaProps({
        gAcaProps: G_ACA_PROPS,
      });
      const DATASOURCE = await getAcaConversationsDatasourceByTenant(TENANT);
      const SHADOW_DATASOURCE = await getConvShadowDatasourceByTenant(TENANT);

      if (
        lodash.isEmpty(DATASOURCE)
      ) {
        const ERROR_MESSAGE = 'Unable to retrieve conversations datasource!';
        throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, ERROR_MESSAGE,
          {
            gAcaProps: G_ACA_PROPS,
          });
      }
      if (
        lodash.isEmpty(params?.message)
      ) {
        const ERROR_MESSAGE = 'Missing required params.message parameter!';
        throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, ERROR_MESSAGE,
          {
            gAcaProps: G_ACA_PROPS,
          });
      }
      const RECORD = this.formRecord(UPDATE, params.message);
      await DATASOURCE.conversations.saveOne(context, {
        conversation: RECORD.conversation,
      });
      if (
        !lodash.isEmpty(SHADOW_DATASOURCE)
      ) {
        await SHADOW_DATASOURCE.conversations.saveOne(
          context,
          {
            value: {
              id: RECORD.conversation.id,
              start: RECORD.conversation.start,
              end: RECORD.conversation.end,
              userId: RECORD.conversation.userId,
              day: RECORD.conversation.day,
              month: RECORD.conversation.month,
              year: RECORD.conversation.year,
              channelMeta: RECORD.conversation.channelMeta,
              hasUserInteraction: RECORD.conversation.hasUserInteraction
            },
          });
      }
      logger.info('Executed conversation logging!', { RECORD });
      return;
    } catch (error) {
      const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
      logger.error(this.defaultExecutor.name, { ACA_ERROR });
      throw ACA_ERROR;
    }
  }

  async executor(
    bot: SoeBotV1,
    update: ISoeUpdateV1,
    message: any,
  ) {
    try {
      await enrichedByLambdaModuleAsyncExecutor({
        moduleId: MODULE_ID,
        adapter: bot,
        update,
        message,
        defaultExecutor: this.defaultExecutor.bind(this),
      });
      return;
    } catch (error) {
      const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
      logger.error(this.executor.name, { ACA_ERROR });
      return;
    }
  }
}
