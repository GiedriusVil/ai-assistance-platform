/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-midleware-analytics-analytics-conversation-logger-ware-incoming';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

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
  botStates,
  middlewareTypes,
} from '@ibm-aiap/aiap-soe-brain';

import {
  AnalyticsConversationLoggerWare,
} from './analytics-conversation-logger-ware';

export class AnalyticsConversationLoggerWareIncoming extends AnalyticsConversationLoggerWare {

  constructor(
    configuration: any,
  ) {
    super(
      [botStates.NEW],
      'analytics-conversation-logger-incoming',
      middlewareTypes.INCOMING,
      configuration
    );
    this.start;
    this.profile;
  }

  __shouldSkip(context) {
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

  formRecord(update, existingUser) {
    return {
      user: {
        id: this.getUserId(update),
        tenantId: this.getTenantId(update),
        assistantId: this.getAssistantId(update),
        externalUserId: this.getUserId(update),
        firstName: this.getFirstName(),
        lastName: this.getLastName(),
        fullName: this.getFullName(),
        country: this.getCountry(),
        created: this.getCreated(existingUser),
        lastVisitTimestamp: this.getLastVisitTimestamp(),
        email: this.getEmail(),
      },
      conversation: {
        id: this.getConversationId(update),
        tenantId: this.getTenantId(update),
        assistantId: this.getAssistantId(update),
        userId: this.getUserId(update),
        hasUserInteraction: this.hasUserInteraction(update),
        start: this.getStart(),
        day: this.getDay(),
        month: this.getMonth(),
        year: this.getYear(),
        dayOfWeek: this.getDayOfWeek(),
        end: this.getStart(),
        duration: 0,
        channel: this.getChannel(update),
        channelMeta: this.getChannelMeta(update),
        clientSideOS: this.getClientSideOS(update),
        clientSideVersion: this.getClientSideVersion(update),
        clientSideWindowSize: this.getClientSideWindowSize(update),
        clientSideSoftwareType: this.getClientSideSoftwareType(update),
        clientSideHostname: this.getClientSideHostname(update),
        clientSideBrowserName: this.getClientSideBrowserName(update),
        clientSideBrowserLanguage: this.getClientSideBrowserLanguage(update),
      },
    };
  }

  async defaultExecutor(context, params) {
    let update;
    let gAcaProps;
    try {
      update = params?.update;
      gAcaProps = update?.raw?.gAcaProps;
      if (lodash.isEmpty(update)) {
        {
          const MESSAGE = 'Missing required params.update parameter!';
          throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, MESSAGE, {
            gAcaProps,
          });
        }
      }
      if (update?.skipConversationLogger) {
        return;
      }

      const TENANTS_CACHE_PROVIDER = getTenantsCacheProvider();
      const TENANT = await TENANTS_CACHE_PROVIDER.tenants.findOneByGAcaProps({
        gAcaProps,
      });
      const DATASOURCE = await getAcaConversationsDatasourceByTenant(TENANT);
      const DATASOURCE_SHADOW = await getConvShadowDatasourceByTenant(TENANT);

      if (lodash.isEmpty(DATASOURCE)) {
        const MESSAGE = 'Unable to retrieve conversations datasource!';
        throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, MESSAGE, {
          gAcaProps,
        });
      }

      this.setStartTime();
      this.setProfile(update);

      let existingUser = {};
      let record = this.formRecord(update, existingUser);

      if (
        !lodash.isEmpty(record?.user?.id)
      ) {
        existingUser = await DATASOURCE.users.findOneById(context, {
          id: record?.user?.id,
        });
        record = this.formRecord(update, existingUser);
      }

      const PROMISES = [];
      PROMISES.push(
        DATASOURCE.conversations.saveOne(context, {
          conversation: record.conversation,
        })
      );

      if (
        !lodash.isEmpty(DATASOURCE_SHADOW)
      ) {
        PROMISES.push(
          DATASOURCE_SHADOW.conversations.saveOne(
            context,
            {
              value: {
                id: record.conversation.id,
                start: record.conversation.start,
                end: record.conversation.end,
                userId: record.conversation.userId,
                day: record.conversation.day,
                month: record.conversation.month,
                year: record.conversation.year,
                channelMeta: record.conversation.channelMeta,
                hasUserInteraction: record.conversation.hasUserInteraction,
                duration: record.conversation.duration
              },
            })
        );
      }

      PROMISES.push(DATASOURCE.users.saveOne(context, { user: record.user }));
      await Promise.all(PROMISES);

      logger.info('Executed conversation logging!');
      return;
    } catch (error) {
      const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
      logger.error(this.defaultExecutor.name, { ACA_ERROR });
      throw ACA_ERROR;
    }
  }

  async executor(bot, update) {
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
