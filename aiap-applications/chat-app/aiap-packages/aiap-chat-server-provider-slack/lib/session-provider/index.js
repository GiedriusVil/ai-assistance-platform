/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-chat-server-session-provider-slack-session-provider';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const ramda = require('@ibm-aca/aca-wrapper-ramda');
const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { formatIntoAcaError, throwAcaError, ACA_ERROR_TYPE, appendDataToError } = require('@ibm-aca/aca-utils-errors');

const { getChannelBySessionProviderAndChannelId } = require('@ibm-aiap/aiap-chat-channel-provider');

const { authorizationService } = require('@ibm-aiap/aiap-authorization-service');

const {
  retrieveStoredSession: retrieveStoredSession,
  storeSession: storeSession,
  deleteSession: deleteSessionFromMemoryStore,
  refreshToken: refreshToken,
} = require('@ibm-aca/aca-utils-session');

const { createTranscript, addMessageToTranscript } = require('@ibm-aca/aca-utils-transcript');

const processorHealthCheck = require('../processor-health-check');
const processorOutgoingMessage = require('../processor-outgoing-message');

const DEFAULT_CHANNEL_ID = 'default';

class SlackSessionProvider {

  static async getInstance(params) {
    try {
      const RET_VAL = new SlackSessionProvider(params);
      await RET_VAL.initialise();
      return RET_VAL;
    } catch (error) {
      const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
      logger.error(`getInstance`, { ACA_ERROR });
      throw ACA_ERROR;
    }
  }


  constructor(configuration) {
    const CONVERSATION_ID = ramda.path(['conversationId'], configuration);
    const SERVER = ramda.path(['server'], configuration);
    const CLIENT = ramda.path(['client'], SERVER);

    const TENANT_ID = ramda.path(['tenant', 'id'], configuration);
    const ASSISTANT_ID = ramda.path(['assistant', 'id'], configuration);
    const ENGAGEMENT_ID = ramda.path(['engagement', 'id'], configuration);

    const SLACK = ramda.path(['slack'], configuration);
    const SLACK_CHANNEL_ID = ramda.path(['channel', 'id'], SLACK);
    const SLACK_USER_ID = ramda.path(['user', 'id'], SLACK);

    const SESSION_EXPIRATION_TIME_IN_SECONDS = ramda.path(['sessionExpirationTimeInSeconds'], configuration);
    try {
      if (
        lodash.isEmpty(CONVERSATION_ID)
      ) {
        const MESSAGE = `Missing required configuration.conversationId parameter!`;
        throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
      }
      if (
        lodash.isEmpty(SERVER)
      ) {
        const MESSAGE = `Missing required configuration.server parameter!`;
        throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
      }
      if (
        lodash.isEmpty(CLIENT)
      ) {
        const MESSAGE = `Missing required configuration.client parameter!`;
        throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
      }
      if (
        lodash.isEmpty(SLACK_CHANNEL_ID)
      ) {
        const MESSAGE = `Missing required configuration.slack.channel.id parameter!`;
        throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
      }
      if (
        lodash.isEmpty(SLACK_USER_ID)
      ) {
        const MESSAGE = `Missing required configuration.slack.user.id parameter!`;
        throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
      }
      if (
        lodash.isEmpty(TENANT_ID)
      ) {
        const MESSAGE = `Missing required configuration.tenant.id parameter!`;
        throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
      }
      if (
        lodash.isEmpty(ASSISTANT_ID)
      ) {
        const MESSAGE = `Missing required configuration.assistant.id parameter!`;
        throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
      }
      if (
        lodash.isEmpty(ENGAGEMENT_ID)
      ) {
        const MESSAGE = `Missing required configuration.engagement.id parameter!`;
        throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
      }
      if (
        lodash.isNil(SESSION_EXPIRATION_TIME_IN_SECONDS)
      ) {
        const MESSAGE = `Missing required configuration.sessionExpirationTimeInSeconds parameter!`;
        throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
      }
      this.conversationId = CONVERSATION_ID;
      this.server = SERVER;
      this.slack = SLACK;
      this.sessionTime = SESSION_EXPIRATION_TIME_IN_SECONDS;
      this.tenant = configuration.tenant;
      this.assistant = configuration.assistant;
      this.engagement = configuration.engagement;
    } catch (error) {
      const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
      appendDataToError(ACA_ERROR, { CONVERSATION_ID, SLACK_CHANNEL_ID, SLACK_USER_ID });
      logger.error(`constructor`, { ACA_ERROR });
      throw ACA_ERROR;
    }
  }

  async initialise() {
    try {
      await this._loadSlackUser();
      this._initialiseGAcaProps();
      logger.info('initialise', { this_gAcaProps: this.gAcaProps });
      this.session = await authorizationService.authorize({ gAcaProps: this.gAcaProps });
      const STORED_CHANNEL = this.session?.channel;
      const IS_NEW = this.session?.isNew;
      const SESSION_EXPIRATION_TIME = this.session?.expirationTime;
      let hasToStartChat = false;
      if (
        lodash.isEmpty(STORED_CHANNEL)
      ) {
        hasToStartChat = true;
        this.session.channel = {
          id: DEFAULT_CHANNEL_ID,
        }
      }
      if (
        lodash.isEmpty(IS_NEW)
      ) {
        this.session.isNew = true;
      }
      if (
        lodash.isEmpty(SESSION_EXPIRATION_TIME)
      ) {
        this.session.expirationTime = parseInt(Date.now() / 1000) + this.sessionTime;
      }
      this.channel = getChannelBySessionProviderAndChannelId(this, this.session.channel.id);
      logger.info(`initialise -> [this.channel.type:${this.channel.type}]`);
      if (hasToStartChat) {
        await this.startChat();
      } else {
        await this.continueChat();
      }
    } catch (error) {
      const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
      appendDataToError(ACA_ERROR, { this_session: this.session });
      logger.error('initialise', { ACA_ERROR });
      throw ACA_ERROR;
    }
  }

  async startChat() {
    try {
      await this.channel.startChat(this.session);
      await storeSession(this.session);
      await createTranscript(this.session);
    } catch (error) {
      const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
      logger.error('startChat', { ACA_ERROR });
      throw ACA_ERROR;
    }
  }

  async continueChat() {
    try {
      await this.channel.continueChat(this.session);
      this._resetToken();
      await storeSession(this.session);
    } catch (error) {
      const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
      logger.error('continueChat', { ACA_ERROR });
      throw ACA_ERROR;
    }
  }

  async handleIncomingMessageEvent(message, body, headers) {
    const PARAMS = {
      provider: this,
      headers: headers,
      body: body,
      message: message,
    };
    let isHealthCheck = false;
    try {
      isHealthCheck = processorHealthCheck.isHealthCheckMessage(PARAMS);
      logger.info('isHealthCheck', { isHealthCheck });
      if (
        isHealthCheck
      ) {
        await processorHealthCheck.processHealthCheckMessage(PARAMS);
      } else {
        const CONFIRMATIONS = ramda.path(['confirmations'], message);
        const MESSAGE = {
          message: {
            text: ramda.path(['text'], message),
            sender_action: ramda.path(['sender_action'], message),
            timestamp: ramda.path(['timestamp'], message)
          },
        };
        if (!lodash.isEmpty(CONFIRMATIONS)) {
          this.session.confirmations = CONFIRMATIONS;
          this._resetToken();
          await storeSession(this.session);
        }
        await this._handleIncomingMessageEvent(MESSAGE);
      }
    } catch (error) {
      const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
      appendDataToError(ACA_ERROR, { headers, body, message });
      logger.error('handleIncomingMessageEvent', { ACA_ERROR });
      throw ACA_ERROR;
    }
  }

  async handleTransferOnClientSideEvent(message) {
    const MESSAGE_SENDER_ACTION = ramda.path(['sender_action'], message);
    const MESSAGE_SENDER_ACTION_CHANNEL_ID = ramda.path(['channelId'], MESSAGE_SENDER_ACTION);
    const MESSAGE_SENDER_ACTION_API_KEY = ramda.path(['apikey'], MESSAGE_SENDER_ACTION);

    const MESSAGE_SENDER_ACTION_TRANSFER_URL = ramda.path(['transferUrl'], MESSAGE_SENDER_ACTION);

    let transferUrl;
    let acaToken;
    try {
      if (
        lodash.isEmpty(MESSAGE_SENDER_ACTION)
      ) {
        const MESSSAGE = `Missing required message.sender_action parameter!`;
        throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, MESSSAGE);
      }
      if (
        lodash.isEmpty(MESSAGE_SENDER_ACTION_CHANNEL_ID)
      ) {
        const MESSAGE = `Missing required message.sender_action.channelId!`;
        throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, MESSAGE);
      }
      if (
        lodash.isEmpty(MESSAGE_SENDER_ACTION_API_KEY)
      ) {
        const MESSAGE = `Missing required message.sender_action.apikey!`;
        throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, MESSAGE);
      }
      if (
        lodash.isEmpty(MESSAGE_SENDER_ACTION_TRANSFER_URL)
      ) {
        const MESSAGE = `Missing required message.sender_action.transferUrl!`;
        throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, MESSAGE);
      }
      delete message.message; // -> We need ability to send action messages from ochestrator without any text!

      await this.checkIfSessionExpired(this.session);
      const ACTIONS = {
        sender_action: MESSAGE_SENDER_ACTION
      };
      this.session = await retrieveStoredSession(this.session);
      this.session.actions = ACTIONS;
      this.session.channel.id = 'default';
      message.type = 'bot';
      message.session = this.session;
      this._resetToken();
      await storeSession(this.session);

      acaToken = ramda.path(['token', 'value'], this.session);
      transferUrl = `${MESSAGE_SENDER_ACTION_TRANSFER_URL}&acaToken=${acaToken}`;

      message.message = {
        text: `<a href="${transferUrl}">Click for transfer</a>`
      }

      logger.info(`${MODULE_ID} --> handleTransferOnClientSideEvent`, {
        this_session: this.session,
        message: message
      });

      await this.sendOutgoingMessage(message);
    } catch (error) {
      const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
      appendDataToError(ACA_ERROR, { message });
      logger.error('handleTransferOnClientSideEvent', { ACA_ERROR });
      throw ACA_ERROR;
    }
  }

  async handleTransferToBot(message) {
    try {
      logger.info('handleTransferToBot | message: ', message);
      const TRANSFER_TO_BOT = message.sender_action;
      const CHANNEL_ID = ramda.pathOr(undefined, ['sender_action', 'channelId'], message);
      const MESSAGE = ramda.pathOr(undefined, ['sender_action', 'message'], message);

      if (lodash.isEmpty(TRANSFER_TO_BOT)) {
        const MESSAGE = `Unable to transfer [transferAction: ${TRANSFER_TO_BOT}]`;
        throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
      }
      if (lodash.isEmpty(CHANNEL_ID)) {
        const MESSAGE = `Unable to transfer [CHANNEL_ID: ${CHANNEL_ID}]`;
        throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
      }
      if (lodash.isEmpty(MESSAGE)) {
        const MESSAGE = `Unable to transfer [MESSAGE: ${MESSAGE}]`;
        throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
      }

      logger.info(`[TRANSFER_TO_BOT] Transfering to bot!`, TRANSFER_TO_BOT);

      message.message.text = MESSAGE;
      message.type = 'bot';
      message.session = this.session;

      this.session.channel.id = CHANNEL_ID;
      this._resetToken();
      await storeSession(this.session);
      await this.sendOutgoingMessage(message);
    } catch (error) {
      const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
      appendDataToError(ACA_ERROR, { message });
      logger.error('handleTransferToBotEvent', { ACA_ERROR });
      throw ACA_ERROR;
    }
  }

  async updateSessionExpirationTime(timestampInSeconds) {
    const PARSED_TIMESTAMP = Number.parseInt(timestampInSeconds);
    if (!lodash.isNaN(PARSED_TIMESTAMP)) {
      this.session.expirationTime = timestampInSeconds + this.sessionTime;
      await storeSession(this.session);
    }
  }

  async sendOutgoingMessage(message) {
    try {
      const CONTEXT = { provider: this };
      const PARAMS = { message };
      await processorOutgoingMessage.processOutgoingMessage(CONTEXT, PARAMS);
    } catch (error) {
      const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
      appendDataToError(ACA_ERROR, { message });
      logger.error('handleIncomingMessageEvent', { ACA_ERROR });
      throw ACA_ERROR;
    }
  }

  slackUserId() {
    const RET_VAL = ramda.path(['user', 'id'], this.slack);
    return RET_VAL;
  }

  client() {
    const RET_VAL = ramda.path(['client'], this.server);
    return RET_VAL;
  }

  async deleteSession() {
    const PROVIDER_CONVERSATION_ID = this.conversationId;
    try {
      if (
        this.session
      ) {
        logger.info('deleteSession', { this_session: this.session });
        await deleteSessionFromMemoryStore(this.session);
        delete this.session;
      }
    } catch (error) {
      const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
      appendDataToError(ACA_ERROR, { PROVIDER_CONVERSATION_ID });
      logger.error('disconnect', { ACA_ERROR });
      throw ACA_ERROR;
    }
  }

  async checkIfSessionExpired(session) {
    const SESSION = await retrieveStoredSession(session);
    if (lodash.isUndefined(SESSION)) {
      await storeSession(session);
    }
  }

  async disconnect(reason = undefined) {
    const PROVIDER_CONVERSATION_ID = this.conversationId;
    try {
      await this.disconnectFromChannel();
      await this.deleteSession();
    } catch (error) {
      const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
      appendDataToError(ACA_ERROR, { PROVIDER_CONVERSATION_ID, reason });
      logger.error('disconnect', { ACA_ERROR });
      throw ACA_ERROR;
    }
  }

  async disconnectFromChannel() {
    const PROVIDER_CONVERSATION_ID = this.conversationId;
    try {
      if (
        this.channel
      ) {
        await this.channel.disconnect();
      }
    } catch (error) {
      const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
      appendDataToError(ACA_ERROR, { PROVIDER_CONVERSATION_ID });
      logger.error('disconnectFromChannel', { ACA_ERROR });
      throw ACA_ERROR;
    }
  }

  _resetToken() {
    refreshToken(this);
  }

  async _loadSlackUser() {
    const SLACK_USER_ID = this.slackUserId();
    try {
      if (
        lodash.isEmpty(SLACK_USER_ID)
      ) {
        const MESSAGE = `SlackSessionProvider - has lost valid state! Missing this.slack.user.id attribute!`;
        throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, MESSAGE);
      }
      const RESPONSE = await this.client().users.info({ user: SLACK_USER_ID })
      const SLACK_USER = ramda.path(['user'], RESPONSE);
      this.slack.user = SLACK_USER;
    } catch (error) {
      const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
      appendDataToError(ACA_ERROR, { this_slack: this.slack });
      logger.error('_loadSlackUser', { ACA_ERROR });
      throw ACA_ERROR;
    }
  }

  async _handleIncomingMessageEvent(message) {
    const PROVIDER_CONVERSATION_ID = this.conversationId;
    try {
      message.gAcaProps = this.gAcaProps;
      message.engagement = ramda.path(['engagement'], this.session);
      this._resetMessageGAcaPropsUser(message);
      this._resetMessageGAcaPropsUserProfile(message);
      this._resetMessageChannel(message);
      this._resetChannelMeta(message);
      this._resetMessagePiConfirmation(message);
      await this.channel.sendMessage(message);
      await addMessageToTranscript(this.session, message);

      this.session.isNew = false;
    } catch (error) {
      const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
      appendDataToError(ACA_ERROR, { PROVIDER_CONVERSATION_ID });
      logger.error('_handleIncomingMessageEvent', { ACA_ERROR });
      throw ACA_ERROR;
    }
  }

  _initialiseGAcaProps() {
    const SLACK_USER_PROFILE = ramda.path(['user', 'profile'], this.slack);

    const G_ACA_PROPS = {
      tenantId: ramda.path(['id'], this.tenant),
      assistantId: ramda.path(['id'], this.assistant),
      engagementId: ramda.path(['id'], this.engagement),
      isoLang: 'en', // We need to fix this!
      user: {
        firstName: ramda.path(['first_name'], SLACK_USER_PROFILE),
        lastName: ramda.path(['last_name'], SLACK_USER_PROFILE),
        email: ramda.path(['email'], SLACK_USER_PROFILE),
      }
    };

    this.gAcaProps = G_ACA_PROPS;
  }

  _resetMessageGAcaPropsUser(message) {
    this._ensureMessageGAcaPropsExistance(message);
    const USER = ramda.path(['user'], this.session);
    if (
      !lodash.isEmpty(USER)
    ) {
      message.gAcaProps.user = USER;
    }
  }

  _resetMessageGAcaPropsUserProfile(message) {
    this._ensureMessageGAcaPropsExistance(message);
    const USER_PROFILE = ramda.path(['userProfile'], this.session);
    if (
      !lodash.isEmpty(USER_PROFILE)
    ) {
      message.gAcaProps.userProfile = USER_PROFILE;
    }
  }

  _resetMessageChannel(message) {
    this._ensureMessageExternalChannelExistance(message);
    const CHANNEL = ramda.path(['channel'], this.session);
    if (
      !lodash.isEmpty(CHANNEL)
    ) {
      message.external = {
        channel:
        {
          id: 'slack'
        }
      };
    }
  }

  _resetChannelMeta(message) {
    this._ensureMessageExternalChannelExistance(message);
    const CHANNEL_META = ramda.path(['channelMeta'], this.session);
    if (
      lodash.isEmpty(CHANNEL_META)
    ) {
      message.channelMeta = {
        type: 'Slack'
      };
    }
  }

  _resetMessagePiConfirmation(message) {
    this._ensureMessagePiConfirmationExistance(message);
    const CONFIRMATION = ramda.path(['confirmations'], this.session);
    if (
      !lodash.isEmpty(CONFIRMATION)
    ) {
      message.confirmations = {
        piAgreement: CONFIRMATION?.piAgreement
      };
    } else {
      message.confirmations = {
        piAgreement: null
      };
    }
  }

  _ensureMessagePiConfirmationExistance(message) {
    if (
      message &&
      lodash.isEmpty(message.confirmations)
    ) {
      message.confirmations = {};
    }
  }

  _ensureMessageGAcaPropsExistance(message) {
    if (
      message &&
      lodash.isEmpty(message.gAcaProps)
    ) {
      message.gAcaProps = {};
    }
  }

  _ensureMessageExternalChannelExistance(message) {
    if (
      message &&
      lodash.isEmpty(message.channel)
    ) {
      message.external = {};
    }
  }

  _ensureChannelMetaExistance(message) {
    if (
      message &&
      lodash.isEmpty(message.channelMeta)
    ) {
      message.channelMeta = {};
    }
  }

}

module.exports = {
  SlackSessionProvider,
}
