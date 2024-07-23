/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-adapter-microsoft-adapter';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const ramda = require('@ibm-aca/aca-wrapper-ramda');
const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { formatIntoAcaError } = require('@ibm-aca/aca-utils-errors');

const { BotFrameworkAdapter, ActivityTypes } = require('botbuilder');
const { EventEmitter } = require('events');

const { SoeBotV1 } = require('@ibm-aiap/aiap-soe-bot');

const { Agent } = require('./Agent');

const { extractAppIdFromToken, getConversationIdWithDate } = require('./utils');
const { getMicrosoftCredentialsByAppId, getGAcaPropsByAppId } = require('./providers');

const BOT_ENDPOINT = '/api/messages';
const BOT_UNAVAILABLE_MESSAGE = 'Tapahtui virhe. Chatbot ei ole saatavilla juuri nyt.';

class MicrosoftAdapter extends SoeBotV1 {
  constructor(settings, app, session, server) {
    super({
      settings: settings?.acaAdapterMicrosoft,
      sessionStorage: session,
      server: server,
    });
    this.app = app;
    this.session = session;
    this.settings = {};
    this.implements = {
      clientSideMasking: false,
      concierge: false,
      tagReplace: false,
      structuredMessage: false,
      typing: false,
      video: false,
      close: false,
    };
    this.receives.text = true;
    this.sends.text = true;
    this.type = 'Microsoft';
    this.gAcaProps = {};

    this.__initAdapter();
    this.__createMountPoints();
  }

  __initAdapter() {
    this.bot = new BotFrameworkAdapter(this.settings);
    this.bot.onTurnError = async (context, error) => {
      logger.error('[ADAPTER][MICROSOFT][ERROR] The bot has encountered an error: ', error);
      // Send a message to user
      await context.sendActivity(BOT_UNAVAILABLE_MESSAGE);
    };
    this.emitter = new EventEmitter();
    this.emitter.on('update', update => this.__handleContext(update));
    this.agent = new Agent(this.bot, this.emitter, this.session);
    logger.info(`[ADAPTER][MICROSOFT] ${this.type} adapter connected!`);
  }

  __createMountPoints() {
    this.app.post(BOT_ENDPOINT, (req, res) => {
      this.__supplyBotWithCredentials(req);
      this.bot.processActivity(req, res, async (context) => {
        await this.agent.run(context);
      });
    });
  }

  __supplyBotWithCredentials(req) {
    const INCOMING_MS_BOT_TOKEN = req?.headers?.authorization;
    const APP_ID = extractAppIdFromToken(INCOMING_MS_BOT_TOKEN);
    const CREDENTIALS_BY_APP_ID = getMicrosoftCredentialsByAppId(APP_ID);

    if (!lodash.isEmpty(CREDENTIALS_BY_APP_ID)) {
      this.bot.settings = CREDENTIALS_BY_APP_ID.settings;
      this.bot.credentials = CREDENTIALS_BY_APP_ID.credentials;
      this.bot.credentialsProvider = CREDENTIALS_BY_APP_ID.credentialsProvider;
    }
  }

  async __formatOutgoingMessage(message) {
    return message;
  }

  __handleContext(context) {
    const ACTIVITY_TYPE = context?.activity?.type;
    switch (ACTIVITY_TYPE) {
      case ActivityTypes.Message:
        this.__handleContextOfTypeMessage(context);
        break;
      case ActivityTypes.Invoke:
        this.__handleContextOfTypeInvoke(context);
        break;
    }
  }

  __handleContextOfTypeMessage(context) {
    const TEXT = context?.activity?.text;
    if (lodash.isEmpty(TEXT)) {
      const PAYLOAD = context?.activity?.value?.payload;
      if (!lodash.isEmpty(PAYLOAD)) {
        context.activity.text = PAYLOAD;
      }
    }
    context.activity.text = this.cleanUserInputText(context);
    const UPDATE = this.formatUpdate(context);
    this.__emitUpdate(UPDATE);
  }

  __handleContextOfTypeInvoke(context) {
    const ACTION = context?.activity?.value?.action;
    const TEXT = context?.activity?.text;

    if (lodash.isEmpty(TEXT)) {
      const PAYLOAD = ACTION?.data?.payload;
      if (!lodash.isEmpty(PAYLOAD)) {
        context.activity.text = PAYLOAD;
      }
    }
    const UPDATE = this.formatUpdate(context);
    UPDATE['action'] = ACTION;

    // sender_action can be processed by custom middleware if needed
    const ACTION_TYPE = ACTION?.verb;
    if (!lodash.isEmpty(ACTION_TYPE)) {
      UPDATE.raw.message.sender_action = {
        type: ACTION_TYPE,
      }
    }

    this.__emitUpdate(UPDATE);
  }

  cleanUserInputText(context) {
    const TEXT = context?.activity?.text;
    let retVal = '';
    if (!lodash.isEmpty(TEXT)) {
      retVal = TEXT
        .replace(/\\r/g, '')
        .replace(/\\n/g, '')
        .replace(/\\t/g, '')
        .replace(/\\/g, '');
    }
    return retVal;
  }

  formatUpdate(context) {
    let gAcaProps;
    let engagement;
    let sender;
    let recipient;
    let channel;
    let traceId;
    let raw;
    try {
      const MESSAGE_TEXT = context?.activity?.text;

      gAcaProps = this.__constructGAcaProps(context);
      engagement = context?.engagement;
      sender = {
        id: context?.activity?.conversation?.id,
      };
      recipient = {
        id: context?.activity?.recipient?.id,
      }
      channel = {
        id: context?.activity?.channelId,
      }
      traceId = this.getTraceId(context);
      raw = {
        message: {
          text: MESSAGE_TEXT,
          timestamp: Date.now(),
        },
        gAcaProps: gAcaProps,
        engagement: engagement,
      }
      const RET_VAL = {
        sender,
        recipient,
        channel,
        traceId,
        raw,
      };
      return RET_VAL;
    } catch (error) {
      const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
      logger.error('formatUpdate', { ACA_ERROR });
      throw ACA_ERROR;
    }
  }

  sendUpdate(update, message, context) {
    this.__emitUpdate(
      ramda.mergeDeepRight(update, {
        sender: {
          id: this.__getSenderId(update),
        },
        timestamp: new Date(),
        raw: {
          message: {
            text: message,
          },
        },
        context: context,
      })
    );
  }

  async __sendMessage(outgoingMessage) {
    this.emitter.emit('outgoingMessage', outgoingMessage);
  }

  __getSenderId(message) {
    const RET_VAL = message?.sender?.id || 'N/A';
    return RET_VAL;
  }

  __constructGAcaProps(update) {
    const APP_ID = update?.adapter?.credentials?.appId;
    const RET_VAL = getGAcaPropsByAppId(APP_ID);
    return RET_VAL;
  }

  __getAgentId() {
    return this.agent.getId();
  }

  __getConversationId(update) {
    const RET_VAL = getConversationIdWithDate(update) || update?.recipient?.id || 'N/A';
    return RET_VAL;
  }
}

module.exports = {
  MicrosoftAdapter,
};
