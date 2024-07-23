/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-adapter-microsoft-agent';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { ActivityHandler, TurnContext, MessageFactory, CardFactory } = require('botbuilder');

const { formatIntoAcaError, appendDataToError } = require('@ibm-aca/aca-utils-errors');
const { getAcaEngagementsCacheProvider } = require('@ibm-aca/aca-engagements-cache-provider');
const { getTenantsCacheProvider } = require('@ibm-aiap/aiap-tenants-cache-provider');

const { loadLambdaModuleAsMsTeamsCard } = require('@ibm-aca/aca-lambda-modules-executor')
const { getGAcaPropsByBot } = require('./providers');

const feedbackService = require('./services/feedbacks');
const messageService = require('./services/messages');

const ACTIONS = require('./actions');
const { ACTIVITY } = require('./utils/constants/activities');
const { sanitizeConversationReference } = require('./utils');

const REFERENCE_PREFIX = 'REF_';

class Agent extends ActivityHandler {

  constructor(adapter, emitter, session) {
    super();
    this.id = 'microsoft';
    this.adapter = adapter;
    this.eventEmitter = emitter;
    this.sessionStore = session;
    this.__addListeners();
  }

  __addListeners() {
    this.onMessage(async (context, next) => await this.__onMessage(context, next));
    this.onMembersAdded(async (context, next) => await this.__onMembersAdded(context, next));
    this.onOutgoingMessage = async message => await this.__onOutgoingMessage(message);
    this.onInvokeActivity = async context => await this.__onInvokeActivity(context);
    this.onReactionsAdded(async (context, next) => await this.__onReactionsAdded(context, next));
    this.onReactionsRemoved(async (context, next) => await this.__onReactionsRemoved(context, next));

    this.eventEmitter.on('outgoingMessage', this.onOutgoingMessage);
  }

  getId() {
    return this.id;
  }

  async handleMessage(message) {
    let activity = message?.message?.text;
    const ATTACHMENT_TYPE = message?.message?.attachment?.type;

    if (!lodash.isEmpty(ATTACHMENT_TYPE)) {
      const LAMBDA_MODULE_TEAMS_CARD = await this.loadCardFromLambdaModulesRuntimeStorage(message, ATTACHMENT_TYPE);
      if (lodash.isEmpty(LAMBDA_MODULE_TEAMS_CARD)) {
        logger.error('[ADAPTER][MICROSOFT] Unable to handle attachment type: ', ATTACHMENT_TYPE);
      }
      const CARD = CardFactory.adaptiveCard(LAMBDA_MODULE_TEAMS_CARD);
      activity = MessageFactory.attachment(CARD);
    }

    return activity;
  }

  async __onOutgoingMessage(message) {
    try {
      const REFERENCE_ID = REFERENCE_PREFIX + message.recipient.id;
      const REFERENCE = await this.sessionStore.getData(REFERENCE_ID);
      const OUTGOING_MESSAGE = await this.handleMessage(message);

      await this.adapter.continueConversation(REFERENCE, async turnContext => {
        const RESULT = await turnContext.sendActivity(OUTGOING_MESSAGE);
        const G_ACA_PROPS = getGAcaPropsByBot(this.adapter);
        const BOT_MSG_ID = message?.traceId?.botMessageId;
        const TEAMS_MSD_ID = RESULT?.id;
        const CONTEXT = {
          gAcaProps: G_ACA_PROPS,
        };
        const PARAMS = {
          botMessageId: BOT_MSG_ID,
          msTeamsMessageId: TEAMS_MSD_ID,
        };
        await messageService.updateOneWithTeamsMessageId(CONTEXT, PARAMS);
      });
    } catch (error) {
      const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
      appendDataToError(ACA_ERROR, { message });
      logger.error('__onOutgoingMessage', { ACA_ERROR });
      throw ACA_ERROR;
    }
  }

  async __onMessage(context, next) {
    const LAST_BOT_MESSAGE_TO_REPLACE = await this.findLastBotMessageWithButtonsForReplacement(context);
    if (!lodash.isEmpty(LAST_BOT_MESSAGE_TO_REPLACE)) {
      const TEAMS_ACTIVITY_ID = LAST_BOT_MESSAGE_TO_REPLACE?.msTeamsMessageId;
      if (lodash.isEmpty(TEAMS_ACTIVITY_ID)) {
        logger.error('[ADAPTER][MICROSOFT] Unable to replace message with missing msTeamsMessageId:', LAST_BOT_MESSAGE_TO_REPLACE);
      } else {
        await this.replaceActivityById(context, TEAMS_ACTIVITY_ID, LAST_BOT_MESSAGE_TO_REPLACE);
      }
    }
    await this.addEngagementToContext(context);
    await this.onConversationUpdate(context);
    this.eventEmitter.emit('update', context);
    await next();
  }

  async __onMembersAdded(context, next) {
    const MEMBERS_ADDED = context?.activity?.membersAdded;

    for (let cnt = 0; cnt < MEMBERS_ADDED.length; cnt++) {
      if (MEMBERS_ADDED[cnt].id !== context?.activity?.recipient?.id) {
        logger.info('[ADAPTER][MICROSOFT] New member added to chat', MEMBERS_ADDED[cnt].id);

        // trigger WA welcome node
        context.activity.text = '';
        context.activity.type = 'message';
        await this.addEngagementToContext(context);
        await this.onConversationUpdate(context);
        this.eventEmitter.emit('update', context);
      }
    }
    await next();
  }

  async __onInvokeActivity(context) {
    const ACTIVITY_NAME = context?.activity?.name;
    if (ACTIVITY_NAME === ACTIVITY.ADAPTIVE_CARD_ACTION) {
      const ACTIVITY_ACTION_TYPE = context?.activity?.value?.action?.verb;

      let activityResponse;

      if (!lodash.isEmpty(ACTIVITY_ACTION_TYPE)) {
        const ACTION_TYPE_FOR_LAMBDA_MODULE = ACTIVITY_ACTION_TYPE + 'ReplacementCard';
        const PARAMS = context?.activity?.value;
        const RESPONSE_CARD = await this.loadCardFromLambdaModulesRuntimeStorage(PARAMS, ACTION_TYPE_FOR_LAMBDA_MODULE);

        if (lodash.isEmpty(RESPONSE_CARD)) {
          logger.error('[ADAPTER][MICROSOFT] Unable to process unknown activity action: ', ACTIVITY_ACTION_TYPE);
          activityResponse = ACTIONS.activityResponse.errorNotification();
        } else {
          activityResponse = ACTIONS.activityResponse.replaceCard(RESPONSE_CARD);
          await this.addEngagementToContext(context);
          await this.onConversationUpdate(context);
          this.eventEmitter.emit('update', context);
        }
      }

      return activityResponse;
    }
  }

  async __onReactionsAdded(context, next) {
    await this.wait(2000);
    const G_ACA_PROPS = getGAcaPropsByBot(this.adapter);
    const ACTIVITY = context?.activity;
    const CONTEXT = {
      gAcaProps: G_ACA_PROPS,
      activity: ACTIVITY,
    };
    const MESSAGE = await messageService.findOneByTeamsMessageId(CONTEXT, {});
    const FEEDBACK_SAVE_PARAMS = {
      message: MESSAGE,
    };
    await feedbackService.saveOne(CONTEXT, FEEDBACK_SAVE_PARAMS);
    await next();
  }

  async __onReactionsRemoved(context, next) {
    await this.wait(2000);
    const G_ACA_PROPS = getGAcaPropsByBot(this.adapter);
    const ACTIVITY = context?.activity;
    const CONTEXT = {
      gAcaProps: G_ACA_PROPS,
      activity: ACTIVITY,
    };
    const MESSAGE = await messageService.findOneByTeamsMessageId(CONTEXT, {});
    const FEEDBACK_REMOVE_PARAMS = {
      message: MESSAGE,
    };
    await feedbackService.deleteOne(CONTEXT, FEEDBACK_REMOVE_PARAMS);
    await next();
  }

  async onConversationUpdate(context) {
    const CONVERSATION_REFERENCE = TurnContext.getConversationReference(context.activity);
    sanitizeConversationReference(CONVERSATION_REFERENCE);
    const REFERENCE_ID = REFERENCE_PREFIX + CONVERSATION_REFERENCE.conversation.id;
    try {
      const SESSION_DATA = await this.sessionStore.getData(REFERENCE_ID);
      if (!SESSION_DATA.conversation) {
        this.sessionStore.setData(REFERENCE_ID, CONVERSATION_REFERENCE);
      }
    } catch (error) {
      const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
      appendDataToError(ACA_ERROR, { REFERENCE_ID, CONVERSATION_REFERENCE });
      logger.error('onConversationUpdate', { ACA_ERROR });
      throw ACA_ERROR;
    }
  }

  async loadCardFromLambdaModulesRuntimeStorage(params, type) {
    const G_ACA_PROPS = getGAcaPropsByBot(this.adapter);
    const TENANT_ID = G_ACA_PROPS?.tenantId;
    const MESSAGE = params?.message;
    const ACTION = params?.action;
    const MODULE_ID = 'ms' + lodash.upperFirst(type);

    const CONTEXT = {
      gAcaProps: G_ACA_PROPS,
    }
    const PARAMS = {
      tenant: {
        id: TENANT_ID,
      },
      lambdaModule: {
        id: MODULE_ID,
      },
      message: MESSAGE,
      action: ACTION,
    };

    const RET_VAL = await loadLambdaModuleAsMsTeamsCard(CONTEXT, PARAMS);
    return RET_VAL;
  }

  async replaceActivityById(context, teamsActivityId, message) {
    let activity = message?.message?.text;
    const ATTACHMENT_TYPE = message?.attachment?.type;

    if (!lodash.isEmpty(ATTACHMENT_TYPE)) {
      const ATTACHMENT_TYPE_FOR_LAMBDA_MODULE = ATTACHMENT_TYPE + 'DisabledCard';
      const LAMBDA_MODULE_TEAMS_CARD = await this.loadCardFromLambdaModulesRuntimeStorage({ message: message }, ATTACHMENT_TYPE_FOR_LAMBDA_MODULE);
      if (lodash.isEmpty(LAMBDA_MODULE_TEAMS_CARD)) {
        logger.error('[ADAPTER][MICROSOFT] Unable to handle attachment type: ', ATTACHMENT_TYPE_FOR_LAMBDA_MODULE);
      }
      const CARD = CardFactory.adaptiveCard(LAMBDA_MODULE_TEAMS_CARD);
      activity = MessageFactory.attachment(CARD);
    }
    activity.id = teamsActivityId;
    return context.updateActivity(activity);
  }

  async findLastBotMessageWithButtonsForReplacement(context) {
    let retVal = {};
    const LAST_BOT_MESSAGE = await this.getLastBotMessage(context);
    const ATTACHMENT = LAST_BOT_MESSAGE?.attachment;
    if (!lodash.isEmpty(ATTACHMENT)) {
      const HAS_BUTTONS = LAST_BOT_MESSAGE.attachment.type === 'buttons' || LAST_BOT_MESSAGE.attachment.hasButtons;
      if (HAS_BUTTONS) {
        retVal = LAST_BOT_MESSAGE;
      }
    }
    return retVal;
  }

  async getLastBotMessage(context) {
    const G_ACA_PROPS = getGAcaPropsByBot(this.adapter);
    const ACTIVITY = context?.activity;
    const CONTEXT = {
      gAcaProps: G_ACA_PROPS,
      activity: ACTIVITY,
    };
    const RET_VAL = await messageService.findLastBotMessage(CONTEXT, {});
    return RET_VAL;
  }

  wait(duration) {
    return new Promise(resolve => setTimeout(resolve, duration));
  }

  async addEngagementToContext(context) {
    let engagement;
    let gAcaProps;
    let engagementId;
    let tenant;
    try {
      gAcaProps = getGAcaPropsByBot(this.adapter);
      engagementId = gAcaProps?.engagementId;

      const TENANTS_CACHE_PROVIDER = getTenantsCacheProvider();
      tenant = await TENANTS_CACHE_PROVIDER.tenants.findOneByGAcaProps({ gAcaProps: gAcaProps });

      const ENGAGEMENTS_CACHE_PROVIDER = getAcaEngagementsCacheProvider();
      engagement = await ENGAGEMENTS_CACHE_PROVIDER.engagements.findOneByIdAndHash({
        id: engagementId,
        tenant: tenant
      });
      context.engagement = engagement;
    } catch (error) {
      const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
      appendDataToError(ACA_ERROR, { engagement, tenant, gAcaProps });
      logger.error('addEngagementToContext', { ACA_ERROR });
      throw ACA_ERROR;
    }

  }
}

module.exports = {
  Agent,
};
