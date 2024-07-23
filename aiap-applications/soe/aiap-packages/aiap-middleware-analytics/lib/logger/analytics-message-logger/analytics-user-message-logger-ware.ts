/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-midleware-analytics-analytics-user-message-logger-ware';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import ramda from '@ibm-aca/aca-wrapper-ramda';
import lodash from '@ibm-aca/aca-wrapper-lodash';

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
  MASKED_STRING,
} from '@ibm-aca/aca-data-masking-provider'

import {
  botStates,
  middlewareTypes,
} from '@ibm-aiap/aiap-soe-brain';

import {
  AbstractMessageLoggerWare,
} from './abstract-message-logger-ware';
import { ISoeUpdateV1 } from '@ibm-aiap/aiap--types-soe';
import { IContextV1 } from '@ibm-aiap/aiap--types-server';
import { SoeBotV1 } from '@ibm-aiap/aiap-soe-bot';


const SOURCE = {
  SYSTEM: 'SYSTEM',
  USER: 'USER',
};

export class AnalyticsUserMessageLoggerWare extends AbstractMessageLoggerWare {

  constructor(
    configuration: any,
  ) {
    super(
      [
        botStates.NEW,
        botStates.UPDATE,
        botStates.INTERNAL_UPDATE
      ],
      'analytics-user-message-logger-incoming',
      middlewareTypes.INCOMING,
      configuration
    );
  }

  __shouldSkip(
    context: {
      update: ISoeUpdateV1,
    },
  ) {
    const PARAMS = {
      update: context?.update,
      skipSenderActionTypes: [],
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
  ) {
    let retVal = update?.raw?.message?.text;
    if (
      update?.skipLogging ||
      update?.source === SOURCE.SYSTEM
    ) {
      retVal = MASKED_STRING;
    }
    return retVal;
  }

  /** Returns source USER or SYSTEM */
  getAuthor(
    update: ISoeUpdateV1,
  ) {
    let retVal;
    const MESSAGE = this.getMessage(update);
    if (
      lodash.startsWith(MESSAGE, '§§')
    ) {
      retVal = SOURCE.SYSTEM;
    } else {
      retVal = ramda.pathOr(SOURCE.USER, ['source'], update);
      if (
        lodash.isString(retVal)
      ) {
        retVal.toUpperCase();
      }
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
    update: ISoeUpdateV1,
  ) {
    let retVal;
    if (
      update?.raw?.message?.sender_action
    ) {
      retVal = update?.raw?.message?.sender_action;
    }
    return retVal;
  }

  formRecord(
    update: ISoeUpdateV1,
    message: any,
  ) {
    const RET_VAL = {
      id: this.getMessageId(update),
      // EXTERNAL_IDENTIFIERS - START
      tenantId: this.getTenantId(update),
      assistantId: this.getAssistantId(update),
      utteranceId: this.getUtteranceId(update),
      conversationId: this.getConversationId(update),
      // EXTERNAL_IDENTIFIERS - END
      message: this.getMessage(update),
      status: this.getStatus(),
      created: this.getCreated(),
      author: this.getAuthor(update),
      attachment: this.getAttachment(message),
      action: this.getAction(update),
    };
    return RET_VAL;
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

      const RECORD = this.formRecord(UPDATE, undefined);
      await DATASOURCE.messages.saveOne(context, { message: RECORD });

      if (
        !lodash.isEmpty(SHADOW_DATASOURCE)
      ) {
        await SHADOW_DATASOURCE.messages.saveOne(
          context,
          {
            value: {
              id: RECORD.id,
              created: RECORD.created,
              conversationId: RECORD.conversationId,
              utteranceId: RECORD.utteranceId,
              action: RECORD.action,
              author: RECORD.author,
              message: RECORD.message,
            }
          }
        );
      }

      logger.info('Executed user-message logging!');
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
  ) {
    try {
      await enrichedByLambdaModuleAsyncExecutor({
        moduleId: MODULE_ID,
        adapter: bot,
        update,
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
