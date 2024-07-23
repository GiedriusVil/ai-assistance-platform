/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-analytics-live-datasource-mongo';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const ramda = require('@ibm-aca/aca-wrapper-ramda');
const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { formatIntoAcaError, throwAcaError, ACA_ERROR_TYPE } = require('@ibm-aca/aca-utils-errors');

const { AcaAnalyticsLiveDatasource } = require('../datasource');

const { getAcaMongoClient } = require('@ibm-aiap/aiap-mongo-client-provider');
const { createIndex } = require('@ibm-aiap/aiap-utils-mongo')

const { sanitizedCollectionsFromConfiguration } = require('./collections.utils');

const _conversations = require('./conversations');
const _utterances = require('./utterances');
const _feedbacks = require('./feedbacks');
const _usageByGroup = require('./usage-by-group');
const _users = require('./users');
const _surveys = require('./surveys');
const _dashboardsConfigurations = require('./dashboards-configurations');
const _messages = require('./messages');

const _reports = {}; // [LEGO] for some reason this functionality is missing!!!!


class AcaAnalyticsLiveDatasourceMongo extends AcaAnalyticsLiveDatasource {

  constructor(configuration) {
    super(configuration);

    this._collections = sanitizedCollectionsFromConfiguration(this.configuration);

    const ACA_MONGO_CLIENT_ID = ramda.path(['client'], this.configuration);
    const ACA_MONGO_CLIENT_HASH = ramda.path(['clientHash'], this.configuration);

    this.acaMongoClient = getAcaMongoClient(ACA_MONGO_CLIENT_ID, ACA_MONGO_CLIENT_HASH);
  }

  async _getClient() {
    const RET_VAL = await this.acaMongoClient.getClient();
    return RET_VAL;
  }

  async _getDB() {
    const RET_VAL = await this.acaMongoClient.getDB();
    return RET_VAL;
  }

  async _getAcaMongoClient() {
    let retVal;
    try {
      retVal = this.acaMongoClient;
      if (
        lodash.isEmpty(retVal)
      ) {
        const ACA_MONGO_CLIENT_ID = ramda.path(['client'], this.configuration);
        const ACA_MONGO_CLIENT_HASH = ramda.path(['clientHash'], this.configuration);

        this.acaMongoClient = getAcaMongoClient(ACA_MONGO_CLIENT_ID, ACA_MONGO_CLIENT_HASH);
        retVal = this.acaMongoClient;
      }
      if (
        lodash.isEmpty(retVal)
      ) {
        const MESSAGE = `Unable to retrieve AcaMongoClient!`;
        throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, MESSAGE);
      }
      return retVal;
    } catch (error) {
      const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
      logger.error('_getAcaMongoClient', { ACA_ERROR });
      throw ACA_ERROR;
    }
  }

  async initialize() {
    await this._ensureIndexes();
  }

  async _ensureIndexes() {
    try {
      const DB = await this._getDB();
      const COLLECTIONS = this._collections;
      await createIndex(DB, COLLECTIONS.conversations, { start: 1 });
      await createIndex(DB, COLLECTIONS.conversations, { end: 1 });
      await createIndex(DB, COLLECTIONS.conversations, { assistantId: 1 });
      await createIndex(DB, COLLECTIONS.conversations, { userId: 1 });
      await createIndex(DB, COLLECTIONS.conversations, { 'channelMeta.hostname': 1 });

      await createIndex(DB, COLLECTIONS.utterances, {
        timestamp: 1
      });
      await createIndex(DB, COLLECTIONS.utterances, {
        timestamp: 1,
        assistantId: 1,
      });

      await createIndex(DB, COLLECTIONS.utterances, {
        timestamp: 1,
        assistantId: 1,
        'aiServiceResponse.external.result.entities': 1,
        'aiServiceResponse.external.result.entities.entity': 1
      });
      await createIndex(DB, COLLECTIONS.utterances, {
        timestamp: 1,
        assistantId: 1,
        'aiServiceResponse.external.result.entities.entity': 1
      });
      await createIndex(DB, COLLECTIONS.utterances, {
        timestamp: 1,
        assistantId: 1,
        'aiServiceResponse.external.result.intents.intent': 1,
      });
      await createIndex(DB, COLLECTIONS.utterances, {
        timestamp: 1,
        assistantId: 1,
        'aiServiceResponse.external.result.intents': 1,
        'aiServiceResponse.external.result.intents.intent': 1,
      });

      // TODO Lower index cannot be create - limitation of MongoDb!
      // await createIndex(DB, COLLECTIONS.utterances, {
      //   timestamp: 1,
      //   assistantId: 1,
      //   'aiServiceResponse.external.result.entities': 1,
      //   'aiServiceResponse.external.result.entities.entity': 1,
      //   'aiServiceResponse.external.result.intents': 1,
      //   'aiServiceResponse.external.result.intents.intent': 1,
      // });

      await createIndex(DB, COLLECTIONS.utterances, {
        timestamp: 1,
        'response.text': 1,
      });
      await createIndex(DB, COLLECTIONS.utterances, {
        timestamp: 1,
        assistantId: 1,
        'context.private.user.id': 1,
      });
      await createIndex(DB, COLLECTIONS.utterances, {
        timestamp: 1,
        assistantId: 1,
        'response.text': 1,
      });
      await createIndex(DB, COLLECTIONS.utterances, {
        timestamp: 1,
        assistantId: 1,
        'context.private.user.id': 1,
        'response.text': 1,
      });
      await createIndex(DB, COLLECTIONS.utterances, {
        timestamp: 1,
        topIntentScore: 1
      });
      await createIndex(DB, COLLECTIONS.utterances, {
        timestamp: 1,
        metricsTracker: 1
      });
      await createIndex(DB, COLLECTIONS.utterances, {
        timestamp: 1,
        'metricsTracker.createTicket.instanceName': 1
      });
      await createIndex(DB, COLLECTIONS.utterances, {
        timestamp: 1,
        'metricsTracker.transferToAgent.isTransfered': 1
      });
      await createIndex(DB, COLLECTIONS.utterances, { assistantId: 1 });
      await createIndex(DB, COLLECTIONS.utterances, { conversationId: 1 });
      await createIndex(DB, COLLECTIONS.utterances, { topIntentScore: 1 });
      await createIndex(DB, COLLECTIONS.utterances, { metricsTracker: 1 });
      await createIndex(DB, COLLECTIONS.utterances, { 'metricsTracker.createTicket.instanceName': 1 });
      await createIndex(DB, COLLECTIONS.utterances, { 'metricsTracker.transferToAgent.isTransfered': 1 });
      await createIndex(DB, COLLECTIONS.utterances, { 'response.text': 1 });
      await createIndex(DB, COLLECTIONS.utterances, { 'context.private.user.id': 1 });
      await createIndex(DB, COLLECTIONS.utterances, { 'context.private.userProfile.userId': 1 });
      await createIndex(DB, COLLECTIONS.utterances, { source: 1 });
      await createIndex(DB, COLLECTIONS.utterances, { dialogNodes: 1 });
      await createIndex(DB, COLLECTIONS.utterances, { 'source': 'text', 'response.text': 'text' });

      await createIndex(DB, COLLECTIONS.users, { externalUserId: 1 });
      await createIndex(DB, COLLECTIONS.users, { country: 1 });
      await createIndex(DB, COLLECTIONS.users, { assistantId: 1 });
      await createIndex(DB, COLLECTIONS.users, { created: 1 });
      await createIndex(DB, COLLECTIONS.users, { email: 1 });
      await createIndex(DB, COLLECTIONS.users, { lastVisitTimestamp: 1 });
      await createIndex(DB, COLLECTIONS.users, { channel: 1 });
      await createIndex(DB, COLLECTIONS.feedbacks, { created: 1 });
      await createIndex(DB, COLLECTIONS.feedbacks, { conversationId: 1 });
      await createIndex(DB, COLLECTIONS.feedbacks, { utteranceId: 1 });
      await createIndex(DB, COLLECTIONS.feedbacks, { score: 1 });
      await createIndex(DB, COLLECTIONS.entities, { assistantId: 1 });
      await createIndex(DB, COLLECTIONS.entities, { timestamp: 1 });
      await createIndex(DB, COLLECTIONS.entities, { userId: 1 });
      await createIndex(DB, COLLECTIONS.entities, { sequence: 1 });
      await createIndex(DB, COLLECTIONS.entities, { entity: 1 });
      await createIndex(DB, COLLECTIONS.surveys, { conversationId: 1 });
      await createIndex(DB, COLLECTIONS.surveys, { assistantId: 1 });
      await createIndex(DB, COLLECTIONS.surveys, { created: 1 });
      await createIndex(DB, COLLECTIONS.surveys, { score: 1 });
    } catch (error) {
      const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
      ACA_ERROR.configuration = this.configuration;
      logger.error(this._ensureIndexes.name, { ACA_ERROR });
      throw ACA_ERROR;
    }
  }

  get conversations() {
    const RET_VAL = {
      findByQueryDayGroups: (context, params) => {
        return _conversations.findByQueryDayGroups(this, context, params);
      },
      findByQueryHourGroups: (context, params) => {
        return _conversations.findByQueryHourGroups(this, context, params);
      },
      findByQueryMonthGroups: (context, params) => {
        return _conversations.findByQueryMonthGroups(this, context, params);
      },
      findAvgDurationByQueryDayGroups: (context, params) => {
        return _conversations.findAvgDurationByQueryDayGroups(this, context, params);
      },
      findAvgDurationByQueryHourGroups: (context, params) => {
        return _conversations.findAvgDurationByQueryHourGroups(this, context, params);
      },
      countByQuery: (context, params) => {
        return _conversations.countByQuery(this, context, params);
      },
      avgDurationByQuery: (context, params) => {
        return _reports.avgConversationDuration.findAll(this.models, context, params);
      },
      findWithUserInteractionDayGroups: (context, params) => {
        return _conversations.findWithUserInteractionDayGroups(this, context, params);
      },
      findWithUserInteractionHourGroups: (context, params) => {
        return _conversations.findWithUserInteractionHourGroups(this, context, params);
      },
      findChannelUsersByQueryMonthGroups: (context, params) => {
        return _conversations.findChannelUsersByQueryMonthGroups(this, context, params);
      }
    };
    return RET_VAL;
  }

  get dashboardsConfigurations() {
    const RET_VAL = {
      saveOne: (context, params) => {
        return _dashboardsConfigurations.saveOne(this, context, params);
      },
      deleteManyByIds: (context, params) => {
        return _dashboardsConfigurations.deleteManyByIds(this, context, params);
      },
      findOneByDashboardName: (context, params) => {
        return _dashboardsConfigurations.findOneByDashboardName(this, context, params);
      },
      findOneById: (context, params) => {
        return _dashboardsConfigurations.findOneById(this, context, params);
      },
      findManyByQuery: (context, params) => {
        return _dashboardsConfigurations.findManyByQuery(this, context, params);
      }
    };
    return RET_VAL;
  }

  get utterances() {
    const RET_VAL = {
      findManyByQuery: (context, params) => { },
      findTopIntentsByQuery: (context, params) => {
        return _utterances.findTopIntentsByQuery(this, context, params);
      },
      findLastIntentsByQuery: (context, params) => {
        return _utterances.findLastIntentsByQuery(this, context, params);
      },
      findNegTopIntentsByQuery: (context, params) => {
        return _utterances.findNegTopIntentsByQuery(this, context, params);
      },
      findLowConfidenceIntentsByQuery: (context, params) => {
        return _utterances.findLowConfidenceIntentsByQuery(this, context, params);
      },
      findTransferIntentsByQuery: (context, params) => {
        return _utterances.findTransferIntentsByQuery(this, context, params);
      },
      findTransferTotalsByQueryDayGroups: (context, params) => {
        return _utterances.findTransferTotalsByQueryDayGroups(this, context, params);
      },
      findTransferTotalsByQueryHourGroups: (context, params) => {
        return _utterances.findTransferTotalsByQueryHourGroups(this, context, params);
      },
      countByQuery: (context, params) => {
        return _utterances.countByQuery(this, context, params);
      },
      countByQueryAiSkillGroups: (context, params) => {
        return _utterances.countByQueryAiSkillGroups(this, context, params);
      },
      countTransfersByQuery: (context, params) => {
        return _utterances.countTransfersByQuery(this, context, params);
      },
      countByQueryDayGroups: (context, params) => {
        return _utterances.countByQueryDayGroups(this, context, params);
      },
      countByQueryHourGroups: (context, params) => {
        return _utterances.countByQueryHourGroups(this, context, params);
      },
      avgPerConversationByQuery: (context, params) => {
        return _utterances.avgPerConversationByQuery(this, context, params);
      },
      avgPerConversationByQueryDayGroups: (context, params) => {
        return _utterances.avgPerConversationByQueryDayGroups(this, context, params);
      },
      avgPerConversationByQueryHourGroups: (context, params) => {
        return _utterances.avgPerConversationByQueryHourGroups(this, context, params);
      },
      countByQueryActionNeeded: (context, params) => {
        return _utterances.countByQueryActionNeeded(this, context, params);
      },
      countByQueryFalsePositive: (context, params) => {
        return _utterances.countByQueryFalsePositive(this, context, params);
      },
      findResponseConfidenceByQueryMonthGroups: (context, params) => {
        return _utterances.findResponseConfidenceByQueryMonthGroups(this, context, params);
      },
      findUsersPersonaByQueryMonthGroups: (context, params) => {
        return _utterances.findUsersPersonaByQueryMonthGroups(this, context, params);
      },
      findResponseConfidenceTargetMonthGroups: (context, params) => {
        return _utterances.findResponseConfidenceTargetMonthGroups(this, context, params);
      },
      findChatsByQueryMonthGroups: (context, params) => {
        return _utterances.findChatsByQueryMonthGroups(this, context, params);
      },
      findTicketsByQueryMonthGroups: (context, params) => {
        return _utterances.findTicketsByQueryMonthGroups(this, context, params);
      },
      findChatsTicketsByQueryMonthGroups: (context, params) => {
        return _utterances.findChatsTicketsByQueryMonthGroups(this, context, params);
      },
      findZendeskPOPChatsByQueryMonthGroups: (context, params) => {
        return _utterances.findZendeskPOPChatsByQueryMonthGroups(this, context, params);
      },
      findZendeskPOPTicketsByQueryMonthGroups: (context, params) => {
        return _utterances.findZendeskPOPTicketsByQueryMonthGroups(this, context, params);
      },
      findZendeskPSISTicketsByQueryMonthGroups: (context, params) => {
        return _utterances.findZendeskPSISTicketsByQueryMonthGroups(this, context, params);
      },
      findZendeskPOPChatsTicketsPSISTicketsByQueryMonthGroups: (context, params) => {
        return _utterances.findZendeskPOPChatsTicketsPSISTicketsByQueryMonthGroups(this, context, params);
      },
    };
    return RET_VAL;
  }

  get feedbacks() {
    const RET_VAL = {
      positiveAndNegativeFeedbacks: (context, params) => {
        return _feedbacks.positiveAndNegativeFeedbacks(this, context, params);
      },
      findPositiveFeedbacksByQueryMonthGroups: async (context, params) => {
        return _feedbacks.findPositiveFeedbacksByQueryMonthGroups(this, context, params);
      },
      findPositiveFeedbacksTargetByQueryMonthGroups: async (context, params) => {
        return _feedbacks.findPositiveFeedbacksTargetByQueryMonthGroups(this, context, params);
      },
    };
    return RET_VAL;
  }

  get messages() {
    const RET_VAL = {
      findManyByQuery: (context, params) => {
        return _reports.messages.findAll(this, params);
      },
      findTransferTotalsByQueryDayGroups: (context, params) => {
        return _messages.findTransferTotalsByQueryDayGroups(this, context, params);
      },
      findTransferTotalsByQueryHourGroups: (context, params) => {
        return _messages.findTransferTotalsByQueryHourGroups(this, context, params);
      },
      countByQueryActionNeeded: (context, params) => {
        return _messages.countByQueryActionNeeded(this, context, params);
      },
      countByQueryFalsePositive: (context, params) => {
        return _messages.countByQueryFalsePositive(this, context, params);
      },
      countByQuery: (context, params) => {
        return _messages.countByQuery(this, context, params);
      },
      avgPerConversationByQuery: (context, params) => {
        return _messages.avgPerConversationByQuery(this, context, params);
      },
    };
    return RET_VAL;
  }

  get channels() {
    const RET_VAL = {
      findManyByQuery: (context, params) => {
        return _reports.channels.findAll(this, params);
      },
    };
    return RET_VAL;
  }

  get users() {
    const RET_VAL = {
      findManyByQuery: (context, params) => {
        return _reports.users.findAll(this, params);
      },
      findCountriesByQuery: (context, params) => {

      },
      countByQuery: (context, params) => {

      },
      findTotalUsersByQueryMonthGroups: (context, params) => {
        return _users.findTotalUsersByQueryMonthGroups(this, context, params);
      },
      findNewUsersByQueryMonthGroups: (context, params) => {
        return _users.findNewUsersByQueryMonthGroups(this, context, params);
      },
      findReturningUsersByQueryMonthGroups: (context, params) => {
        return _users.findReturningUsersByQueryMonthGroups(this, context, params);
      },
      findUsageByCountryByQueryMonthGroups: (context, params) => {
        return _users.findUsageByCountryByQueryMonthGroups(this, context, params);
      },
    };
    return RET_VAL;
  }

  get tones() {
    const RET_VAL = {
      findManyByQuery: (context, params) => {
        return _reports.tones.findAll(this, params);
      },
    };
    return RET_VAL;
  }

  get aiServices() {
    const RET_VAL = {
      findManyByQuery: params => {
        return _reports.workspaces.findAll(this, params);
      },
    };
    return RET_VAL;
  }

  get aiIntents() {
    const RET_VAL = {
      findManyByQuery: (context, params) => {
        return _reports.watson.allIntents(this, params);
      },
      findManyWithLowConfidenceByQuery: (context, params) => {
        return _reports.watson.lowConfidenceIntents(this, params);
      },
      findManyWithNegativeFeedbackByQuery: (context, params) => {
        return _reports.watson.negativeFeedbackIntents(this, params);
      },
      findManyBeforeTransferByQuery: (context, params) => {
        return _reports.watson.lastIntentBeforeTransfer(this, params);
      },
      findTreeGraphsByQyery: (context, params) => {
        return _reports.intentsTreeGraph.get(this, params);
      }
    };
    return RET_VAL;
  }

  get aiEntities() {
    const RET_VAL = {
      findAllEntities: (context, params) => {
        return _reports.watson.allEntities(this, params);
      },
    };
    return RET_VAL;
  }

  get usageByGroup() {
    const RET_VAL = {
      findConnectToAgentByQueryMonthGroups: (context, params) => {
        return _usageByGroup.findConnectToAgentByQueryMonthGroups(this, context, params);
      },
      findGoodsRequestsByQueryMonthGroups: (context, params) => {
        return _usageByGroup.findGoodsRequestsByQueryMonthGroups(this, context, params);
      },
      findAccountingByQueryMonthGroups: (context, params) => {
        return _usageByGroup.findAccountingByQueryMonthGroups(this, context, params);
      },
      findApproverFlowByQueryMonthGroups: (context, params) => {
        return _usageByGroup.findApproverFlowByQueryMonthGroups(this, context, params);
      },
      findErrorMessageByQueryMonthGroups: (context, params) => {
        return _usageByGroup.findErrorMessageByQueryMonthGroups(this, context, params);
      },
      findBuyerInformationByQueryMonthGroups: (context, params) => {
        return _usageByGroup.findBuyerInformationByQueryMonthGroups(this, context, params);
      },
    };
    return RET_VAL;
  }
  get surveys() {
    const RET_VAL = {
      findPositiveSurveysByQueryMonthGroups: async (context, params) => {
        return _surveys.findPositiveSurveysByQueryMonthGroups(this, context, params);
      },
      findPositiveSurveysTargetByQueryMonthGroups: async (context, params) => {
        return _surveys.findPositiveSurveysTargetByQueryMonthGroups(this, context, params);
      },
    };
    return RET_VAL;
  }
}

module.exports = {
  AcaAnalyticsLiveDatasourceMongo
};
