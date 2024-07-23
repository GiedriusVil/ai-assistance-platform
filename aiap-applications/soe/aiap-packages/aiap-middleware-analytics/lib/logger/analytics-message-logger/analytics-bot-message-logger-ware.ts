/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-midleware-analytics-analytics-bot-message-logger-ware';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import ramda from '@ibm-aca/aca-wrapper-ramda';
import lodash from '@ibm-aca/aca-wrapper-lodash';

import {
  ACA_ERROR_TYPE,
  formatIntoAcaError,
  throwAcaError,
} from '@ibm-aca/aca-utils-errors';

import {
  ISoeUpdateV1,
} from '@ibm-aiap/aiap--types-soe';

import {
  getTenantsCacheProvider
} from '@ibm-aiap/aiap-tenants-cache-provider';

import {
  getAcaConversationsDatasourceByTenant,
} from '@ibm-aca/aca-conversations-datasource-provider';

import {
  getConvShadowDatasourceByTenant,
} from '@ibm-aiap/aiap-conv-shadow-datasource-provider';

import {
  enrichedByLambdaModuleAsyncExecutor,
  shouldSkipBySenderActionTypes,
} from '@ibm-aca/aca-utils-soe-middleware';

import {
  dataMaskingService,
} from '@ibm-aca/aca-data-masking-provider';

import {
  botStates,
  middlewareTypes,
} from '@ibm-aiap/aiap-soe-brain';

import {
  AbstractMessageLoggerWare,
} from './abstract-message-logger-ware';
import { IContextV1 } from '@ibm-aiap/aiap--types-server';
import { SoeBotV1 } from '@ibm-aiap/aiap-soe-bot';


const CHANNELS_WITH_BOT_MESSAGE_ID = ['slack', 'msteams'];
const SOURCE = {
  SYSTEM: 'SYSTEM',
  BOT: 'BOT',
};

export class AnalyticsBotMessageLoggerWare extends AbstractMessageLoggerWare {

  constructor(
    configuration: any,
  ) {
    super(
      [
        botStates.NEW,
        botStates.UPDATE,
        botStates.INTERNAL_UPDATE
      ],
      'analytics-bot-message-logger-outgoing',
      middlewareTypes.OUTGOING,
      configuration
    );
  }

  __shouldSkip(
    context: {
      update: ISoeUpdateV1,
    }
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

  getMessage(
    update: ISoeUpdateV1,
    message: any,
  ) {
    if (
      lodash.isEmpty(message?.message?.text)
    ) {
      return null;
    }
    const MESSAGE_TEXT = message.message.text;
    if (
      lodash.isEmpty(update?.skipLogging)
    ) {
      return MESSAGE_TEXT;
    }
    const TENANT_ID = this.getTenantId(update);
    const OPTIONS = {
      patterns: this.getPIIPatterns(update),
      tenantId: TENANT_ID,
    };
    const MASKED_STRING = dataMaskingService.mask(MESSAGE_TEXT, OPTIONS);
    return MASKED_STRING;
  }

  getAuthor(
    update: ISoeUpdateV1,
    message: any,
  ) {
    const MESSAGE = this.getMessage(update, message);
    let retVal;
    if (
      lodash.startsWith(MESSAGE, '§§')
    ) {
      retVal = SOURCE.SYSTEM;
    } else {
      retVal = SOURCE.BOT;
    }
    return retVal;
  }

  getAttachment(
    message: any,
  ) {
    const RET_VAL = message?.message?.attachment;
    return RET_VAL;
  }

  getAction(
    message: any,
  ) {
    const RET_VAL = message?.sender_action;
    return RET_VAL;
  }

  getErrors(
    message: any,
  ) {
    const RET_VAL = message?.errors;
    return RET_VAL;
  }

  formRecord(
    update: ISoeUpdateV1,
    message: any,
  ) {
    const RET_VAL = {
      id: this.getMessageId(update, message),
      // EXTERNAL_IDENTIFIERS - START
      tenantId: this.getTenantId(update),
      assistantId: this.getAssistantId(update),
      conversationId: this.getConversationId(update),
      utteranceId: this.getUtteranceId(update),
      // EXTERNAL_IDENTIFIERS - END
      message: this.getMessage(update, message),
      status: this.getStatus(),
      created: this.getCreated(),
      author: this.getAuthor(update, message),
      attachment: this.getAttachment(message),
      action: this.getAction(message),
      errors: this.getErrors(message),
    };
    return RET_VAL;
  }

  getPIIPatterns(update) {
    const PII_PATTERNS = [];
    if (
      update?.skipLogging
    ) {
      const PII_DATA = update?.session?.profile;
      if (
        lodash.isArray(PII_DATA)
      ) {
        PII_DATA.forEach((item) => {
          if (
            !ramda.isEmpty(item.value)
          ) {
            PII_PATTERNS.push({ pattern: item.value });
          }
        });
      }
    }
    return PII_PATTERNS;
  }

  updateTraceIdWithBotMessageId(
    update: ISoeUpdateV1,
    record: any,
  ) {
    const CHANNEL = update?.channel?.id;
    const EXTERNAL_CHANNEL = update?.raw?.external?.channel?.id;
    if (
      (
        lodash.includes(CHANNELS_WITH_BOT_MESSAGE_ID, CHANNEL) ||
        lodash.includes(CHANNELS_WITH_BOT_MESSAGE_ID, EXTERNAL_CHANNEL)
      ) &&
      !lodash.isEmpty(update?.traceId)
    ) {
      update.traceId.botMessageId = record?.id;
    }
  }

  async defaultExecutor(
    context: IContextV1,
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
          const ERROR_MESSAGE = 'Missing required params.update parameter!';
          throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, ERROR_MESSAGE,
            {
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
      const DATASOURCE_SHADOW = await getConvShadowDatasourceByTenant(TENANT);

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
      const RECORD = this.formRecord(UPDATE, params?.message);
      await DATASOURCE.messages.saveOne(context, { message: RECORD });

      if (
        !lodash.isEmpty(DATASOURCE_SHADOW)
      ) {
        await DATASOURCE_SHADOW.messages.saveOne(
          context,
          {
            value: {
              id: RECORD.id,
              created: RECORD.created,
              conversationId: RECORD.conversationId,
              utteranceId: RECORD.utteranceId,
              author: RECORD.author,
              message: RECORD.message,
            }
          }
        );
      }

      this.updateTraceIdWithBotMessageId(UPDATE, RECORD);
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
    } catch (error) {
      const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
      logger.error(this.executor.name, { ACA_ERROR });
      throw ACA_ERROR;
    }
  }
}
