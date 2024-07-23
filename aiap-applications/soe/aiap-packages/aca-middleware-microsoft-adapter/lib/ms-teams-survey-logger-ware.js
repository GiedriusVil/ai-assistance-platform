/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-midleware-microsoft-adapter-ms-teams-survey-logger-ware';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const lodash = require('@ibm-aca/aca-wrapper-lodash');
const ramda = require('@ibm-aca/aca-wrapper-ramda');

const {
  AbstractMiddleware,
  botStates,
  middlewareTypes,
} = require('@ibm-aiap/aiap-soe-brain');

const {
  formatIntoAcaError,
  throwAcaError,
  ACA_ERROR_TYPE,
  appendDataToError,
} = require('@ibm-aca/aca-utils-errors');

const {
  shouldSkipBySenderActionTypes,
} = require('@ibm-aca/aca-utils-soe-middleware');

const {
  getTenantsCacheProvider,
} = require('@ibm-aiap/aiap-tenants-cache-provider');
const {
  getAcaConversationsDatasourceByTenant,
} = require('@ibm-aca/aca-conversations-datasource-provider');

const ACTION = {
  INCOMING: {
    SURVEY: 'survey',
  },
  OUTGOING: {
    SUBMIT_SUCCESS: '§§§SUBMIT_SURVEY_SUCCESS',
    SUBMIT_ERROR: '§§§SUBMIT_SURVEY_ERROR',
  },
};

class MsTeamsSurveyLoggerWare extends AbstractMiddleware {
  constructor() {
    super(
      [
        botStates.NEW,
        botStates.UPDATE,
        botStates.INTERNAL_UPDATE,
        botStates.MONITOR,
      ],
      'ms-teams-survey-logger-ware',
      middlewareTypes.INCOMING
    );
  }

  __shouldSkip(context) {
    const PARAMS = {
      update: context?.update,
      skipSenderActionTypes: [],
    };

    const IGNORE_BY_SENDER_ACTION_TYPE = shouldSkipBySenderActionTypes(PARAMS);

    if (IGNORE_BY_SENDER_ACTION_TYPE) {
      return true;
    }

    return false;
  }

  getTenantId(update) {
    const RET_VAL = update?.raw?.gAcaProps?.tenant;
    return RET_VAL;
  }

  getAssistantId(update) {
    const RET_VAL = update?.raw?.gAcaProps?.assistantId;
    return RET_VAL;
  }

  getConversationId(update) {
    const RET_VAL = update?.traceId?.conversationId;
    return RET_VAL;
  }

  getScore(update) {
    const RET_VAL = update?.action?.data?.score;
    return RET_VAL;
  }

  getComment(update) {
    const RET_VAL = update?.action?.data?.comment;
    return RET_VAL;
  }

  formRecord(update) {
    const RET_VAL = {
      survey: {
        tenantId: this.getTenantId(update),
        assistantId: this.getAssistantId(update),
        conversationId: this.getConversationId(update),
        score: this.getScore(update),
        comment: this.getComment(update),
      },
    };
    return RET_VAL;
  }

  async executor(adapter, update) {
    const SENDER_ACTION = update?.raw?.message?.sender_action?.type;
    let updateSenderId;
    try {
      updateSenderId = update?.sender?.id;
      if (update.action && SENDER_ACTION === ACTION.INCOMING.SURVEY) {
        const G_ACA_PROPS = update?.raw?.gAcaProps;
        if (lodash.isEmpty(G_ACA_PROPS)) {
          const MESSAGE = 'Missing required gAcaProps variable!';
          throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, MESSAGE);
        }

        const TENANTS_CACHE_PROVIDER = getTenantsCacheProvider();
        const TENANT = await TENANTS_CACHE_PROVIDER.tenants.findOneByGAcaProps({
          gAcaProps: G_ACA_PROPS,
        });
        const DATASOURCE = getAcaConversationsDatasourceByTenant(TENANT);

        const RECORD = this.formRecord(update);
        const CONTEXT = {
          user: {
            session: {
              tenant: TENANT,
            },
          },
        };
        await DATASOURCE.surveys.saveOne(CONTEXT, RECORD);

        update.raw.message.text = ACTION.OUTGOING.SUBMIT_SUCCESS;
        update.raw.message.sender_action = {
          type: SENDER_ACTION,
          data: this.formRecord(update),
        };
      }
    } catch (error) {
      const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
      appendDataToError(ACA_ERROR, { updateSenderId });
      logger.error('executor', { ACA_ERROR });
      update.raw.message.text = ACTION.OUTGOING.SUBMIT_ERROR;
    }
  }
}

module.exports = {
  MsTeamsSurveyLoggerWare,
};
