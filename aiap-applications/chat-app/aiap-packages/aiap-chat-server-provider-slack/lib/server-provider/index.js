/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-slack-server';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const ramda = require('@ibm-aca/aca-wrapper-ramda');
const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { formatIntoAcaError, appendDataToError, throwAcaError, ACA_ERROR_TYPE } = require('@ibm-aca/aca-utils-errors');
const { WebClient } = require('@slack/web-api');
const { createEventAdapter } = require('@slack/events-api');
const { createMessageAdapter } = require('@slack/interactive-messages');

const {
  slackInteractionMessage,
  INTERACTION_TYPES,
  BUTTON_ACTION_TYPE,
  isUserSlackMessage,
  retrieveActionId,
  conversationIdBySlackMessage,
  respondToInteractiveActionUrl,
  processFeedback,
  retrieveSlackSessionExpirationTime
} = require('../utils');

const { getSlackSessionProvider } = require('../session-provider-registry');

class AcaSlackServer {

  constructor(routes, configuration) {
    try {
      if (
        !routes
      ) {
        const MESSAGE = `Initialize routes object first!`;
        throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, MESSAGE);
      }
      if (
        lodash.isEmpty(configuration)
      ) {
        const MESSAGE = `Missing required configuration parameter!`;
        throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, MESSAGE);
      }
      this.routes = routes;
      this.setConfiguration(configuration);
    } catch (error) {
      const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
      appendDataToError(ACA_ERROR, { configuration });
      throw ACA_ERROR;
    }
  }

  setConfiguration(configuration) {
    const TENANT_ID = ramda.path(['tenant', 'id'], configuration);
    const ENGAGEMENT_ID = ramda.path(['engagement', 'id'], configuration);
    const ASSISTANT_ID = ramda.path(['assistant', 'id'], configuration);

    const CONFIG_EXTERNAL = ramda.path(['external'], configuration);

    const CONFIG_EXTERNAL_APP_ID = ramda.path(['appId'], CONFIG_EXTERNAL);
    const CONFIG_EXTERNAL_APP_SIGNING_SECRET = ramda.path(['botSigningSecret'], CONFIG_EXTERNAL);
    const CONFIG_EXTERNAL_APP_USER_ACCESS_TOKEN = ramda.path(['botUserAccessToken'], CONFIG_EXTERNAL);

    if (
      lodash.isEmpty(TENANT_ID)
    ) {
      const MESSAGE = `Missing required configuration.tenant.id attribute!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.INITIALIZATION_ERROR, MESSAGE);
    }
    if (
      lodash.isEmpty(ENGAGEMENT_ID)
    ) {
      const MESSAGE = `Missing required configuration.engagement.id attribute!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.INITIALIZATION_ERROR, MESSAGE);
    }
    if (
      lodash.isEmpty(ASSISTANT_ID)
    ) {
      const MESSAGE = `Missing required configuration.assistant.id attribute!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.INITIALIZATION_ERROR, MESSAGE);
    }

    if (
      lodash.isEmpty(CONFIG_EXTERNAL_APP_ID)
    ) {
      const MESSAGE = `Missing required configuration.external.appId attribute!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.INITIALIZATION_ERROR, MESSAGE);
    }
    if (
      lodash.isEmpty(CONFIG_EXTERNAL_APP_SIGNING_SECRET)
    ) {
      const MESSAGE = `Missing required configuration.external.botSigningSecret attribute!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.INITIALIZATION_ERROR, MESSAGE);
    }
    if (
      lodash.isEmpty(CONFIG_EXTERNAL_APP_USER_ACCESS_TOKEN)
    ) {
      const MESSAGE = `Missing required configuration.external.botUserAccessToken attribute!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.INITIALIZATION_ERROR, MESSAGE);
    }
    this.configuration = configuration;
  }

  async initialise() {
    const TENANT_ID = ramda.path(['tenant', 'id'], this.configuration);
    const ENGAGEMENT_ID = ramda.path(['engagement', 'id'], this.configuration);
    const ASSISTANT_ID = ramda.path(['assistant', 'id'], this.configuration);

    const CONFIG_EXTERNAL = ramda.path(['external'], this.configuration);

    const CONFIG_EXTERNAL_APP_ID = ramda.path(['appId'], CONFIG_EXTERNAL); // NOT_SURE_IF_REQUIRED?
    const CONFIG_EXTERNAL_APP_SIGNING_SECRET = ramda.path(['botSigningSecret'], CONFIG_EXTERNAL);
    const CONFIG_EXTERNAL_APP_USER_ACCESS_TOKEN = ramda.path(['botUserAccessToken'], CONFIG_EXTERNAL);

    let authResult;
    let authError;
    try {
      this.initialiseEventAdapter(CONFIG_EXTERNAL_APP_SIGNING_SECRET);
      this.initialiseMessageAdapter(CONFIG_EXTERNAL_APP_SIGNING_SECRET);
      if (
        !this.client
      ) {
        this.client = new WebClient(CONFIG_EXTERNAL_APP_USER_ACCESS_TOKEN);
      } else {
        this.client.token = CONFIG_EXTERNAL_APP_USER_ACCESS_TOKEN;
      }

      authResult = await this.client.auth.test();
      authError = ramda.path(['error'], authResult);
      if (
        !lodash.isEmpty(authError)
      ) {
        const MESSAGE = `Experienced error on this.client.auth.test()`;
        throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, MESSAGE, { authError });
      }
      logger.info('initialise', { authResult });
      const NEW_PATH_EVENT_ADAPTER = `/${TENANT_ID}/${ENGAGEMENT_ID}/${ASSISTANT_ID}/events`;
      if (
        NEW_PATH_EVENT_ADAPTER !== this.pathEventAdapter
      ) {
        this.pathEventAdapter = NEW_PATH_EVENT_ADAPTER;
        this.routes.use(this.pathEventAdapter, this.eventAdapter.expressMiddleware());
      }
      const NEW_PATH_MESSAGE_ADAPTER = `/${TENANT_ID}/${ENGAGEMENT_ID}/${ASSISTANT_ID}/interactions`;
      if (
        NEW_PATH_MESSAGE_ADAPTER !== this.pathMessageAdapter
      ) {
        this.pathMessageAdapter = NEW_PATH_MESSAGE_ADAPTER;
        this.routes.use(this.pathMessageAdapter, this.messageAdapter.requestListener());
      }
    } catch (error) {
      const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
      appendDataToError(ACA_ERROR, { TENANT_ID, ENGAGEMENT_ID, ASSISTANT_ID, CONFIG_EXTERNAL_APP_ID, authResult });
      logger.error(`initialise`, { ACA_ERROR });
      throw ACA_ERROR;
    }
  }

  initialiseEventAdapter(signingSecret) {
    try {
      if (
        this.eventAdapter
      ) {
        this.eventAdapter.signingSecret = signingSecret;
      } else {
        this.eventAdapter = createEventAdapter(signingSecret, {
          includeBody: true,
          includeHeaders: true,
        });
        this.eventAdapter.on('app_home_opened', this.onAppHomeOpened.bind(this));
        this.eventAdapter.on('message', this.onMessage.bind(this));
        this.eventAdapter.on('reaction_added', this.onReactionAdded.bind(this));
        this.eventAdapter.on('reaction_removed', this.onReactionRemoved.bind(this));
        this.eventAdapter.on('error', this.onError.bind(this));
      }
    } catch (error) {
      const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
      logger.error('initialiseEventAdapter', { ACA_ERROR });
      throw ACA_ERROR;
    }
  }

  initialiseMessageAdapter(signingSecret) {
    try {
      if (
        this.messageAdapter
      ) {
        this.messageAdapter.signingSecret = signingSecret;
      } else {
        this.messageAdapter = createMessageAdapter(signingSecret);
        this.messageAdapter.action({ type: 'static_select' }, this.handleStaticSelectAction.bind(this))
        this.messageAdapter.action({ type: 'button' }, this.handleButtonClickAction.bind(this));
      }
    } catch (error) {
      const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
      logger.error('initialiseEventAdapter', { ACA_ERROR });
      throw ACA_ERROR;
    }
  }

  async onAppHomeOpened(message, body, headers) {
    const CONVERSATION_ID = conversationIdBySlackMessage(message);

    const SLACK_APP_TAB = ramda.path(['tab'], message);
    const SLACK_CHANNEL = ramda.path(['channel'], message);
    const SLACK_USER = ramda.path(['user'], message);

    const MESSAGE_TIMESTAMP = ramda.path(['event_ts'], message);
    const TENANT = ramda.path(['tenant'], this.configuration);
    const ASSISTANT = ramda.path(['assistant'], this.configuration);
    const ENGAGEMENT = ramda.path(['engagement'], this.configuration);
    const SESSION_EXPIRATION_TIME_IN_SECONDS = retrieveSlackSessionExpirationTime(this.configuration);

    let params;
    let slackSessionProvider;
    try {
      if (
        'messages' === SLACK_APP_TAB &&
        !lodash.isEmpty(CONVERSATION_ID)
      ) {
        params = {
          server: this,
          conversationId: CONVERSATION_ID,
          slack: {
            user: {
              id: SLACK_USER
            },
            channel: {
              id: SLACK_CHANNEL
            }
          },
          tenant: TENANT,
          assistant: ASSISTANT,
          engagement: ENGAGEMENT,
          sessionExpirationTimeInSeconds: SESSION_EXPIRATION_TIME_IN_SECONDS,
          messageTimestamp: MESSAGE_TIMESTAMP,
          checkForSessionExpired: true
        }
        slackSessionProvider = await getSlackSessionProvider(params);
        if (
          slackSessionProvider?.session?.isNew
        ) {
          message.text = '§§§RESTART_CONVERSATION';
          await slackSessionProvider.handleIncomingMessageEvent(message, body, headers);
        }
        // 
        logger.info(`${MODULE_ID} --> onAppHomeOpened`, {
          message,
          body,
          headers,
          slackSessionProvider,
        });
      }
    } catch (error) {
      const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
      appendDataToError(ACA_ERROR, { CONVERSATION_ID, message, body, headers });
      logger.error('onMessage', { ACA_ERROR });
    }
  }

  async onMessage(message, body, headers) {
    const IS_USER_SLACK_MESSAGE = isUserSlackMessage(message);
    const CONVERSATION_ID = conversationIdBySlackMessage(message);
    const SLACK_CHANNEL = ramda.path(['channel'], message);
    const SLACK_USER = ramda.path(['user'], message);
    const TENANT = ramda.path(['tenant'], this.configuration);
    const ASSISTANT = ramda.path(['assistant'], this.configuration);
    const ENGAGEMENT = ramda.path(['engagement'], this.configuration);
    const MESSAGE_TIMESTAMP = ramda.path(['event_ts'], message);
    const SESSION_EXPIRATION_TIME_IN_SECONDS = retrieveSlackSessionExpirationTime(this.configuration);
    let slackSessionProvider;
    try {
      if (
        IS_USER_SLACK_MESSAGE &&
        !lodash.isEmpty(CONVERSATION_ID)
      ) {
        const PARAMS = {
          conversationId: CONVERSATION_ID,
          server: this,
          slack: {
            user: {
              id: SLACK_USER
            },
            channel: {
              id: SLACK_CHANNEL
            }
          },
          tenant: TENANT,
          assistant: ASSISTANT,
          engagement: ENGAGEMENT,
          messageTimestamp: MESSAGE_TIMESTAMP,
          sessionExpirationTimeInSeconds: SESSION_EXPIRATION_TIME_IN_SECONDS,
        }
        slackSessionProvider = await getSlackSessionProvider(PARAMS);
        if (
          slackSessionProvider?.session?.isNew
        ) {
          message.text = '§§§RESTART_CONVERSATION';
        }
        await slackSessionProvider.handleIncomingMessageEvent(message, body, headers);
        logger.info(`${MODULE_ID} --> onMessage`, {
          message,
          body,
          headers,
        });
      } else {
        // 2022-03-29 [LEGO] Leaving this comment - cause I do not konw which part of logic should reside here!
      }
    } catch (error) {
      const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
      appendDataToError(ACA_ERROR, { CONVERSATION_ID, IS_USER_SLACK_MESSAGE, message, body, headers });
      logger.error('onMessage', { ACA_ERROR });
    }
  }

  async onReactionAdded(message, body, headers) {

    logger.info(`${MODULE_ID} --> onReactionAdded`, {
      message,
      body,
      headers,
    });
  }

  async onReactionRemoved(message, body, headers) {

    logger.info(`${MODULE_ID} --> onReactionRemoved`, {
      message,
      body,
      headers,
    });
  }

  async onError(error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.info(`${MODULE_ID} --> onError`, { ACA_ERROR, this_configuration: this.configuration });
    logger.error('onError', { ACA_ERROR });
  }

  async handleButtonClickAction(payload, response) {
    const CONVERSATION_ID = conversationIdBySlackMessage(payload);
    const SLACK_CHANNEL = ramda.path(['channel', 'id'], payload);
    const SLACK_USER = ramda.path(['user', 'id'], payload);
    const TENANT = ramda.path(['tenant'], this.configuration);
    const ASSISTANT = ramda.path(['assistant'], this.configuration);
    const ENGAGEMENT = ramda.path(['engagement'], this.configuration);
    const BUTTON_ACTION = ramda.path(['actions', 0], payload);
    const ACTION_ID_TEXT = ramda.path(['action_id'], BUTTON_ACTION);
    const ACTION_ID = retrieveActionId(ACTION_ID_TEXT);
    const MESSAGE_TIMESTAMP = ramda.path(['message', 'ts'], payload);
    const SESSION_EXPIRATION_TIME_IN_SECONDS = retrieveSlackSessionExpirationTime(this.configuration);
    let slackSessionProvider;
    let message;
    try {
      if (ACTION_ID === BUTTON_ACTION_TYPE.FEEDBACK) {
        const PARAMS_TO_RESPONSE = {
          payload: payload,
          type: INTERACTION_TYPES.FEEDBACK
        };
        await respondToInteractiveActionUrl(PARAMS_TO_RESPONSE);
        const FEEDBACK_PARAMS = {
          tenantId: TENANT,
          message: payload
        };
        await processFeedback(FEEDBACK_PARAMS);
      } else {
        if (
          !lodash.isEmpty(CONVERSATION_ID)
        ) {
          const PARAMS = {
            conversationId: CONVERSATION_ID,
            server: this,
            slack: {
              user: {
                id: SLACK_USER
              },
              channel: {
                id: SLACK_CHANNEL
              }
            },
            tenant: TENANT,
            assistant: ASSISTANT,
            engagement: ENGAGEMENT,
            messageTimestamp: MESSAGE_TIMESTAMP,
            sessionExpirationTimeInSeconds: SESSION_EXPIRATION_TIME_IN_SECONDS,
          };
          {
            message = slackInteractionMessage(payload);
            message.text = ramda.path(['value'], BUTTON_ACTION);

            if (!lodash.isEmpty(ACTION_ID)) {
              const PARAMS_TO_PROCESS = {
                message: message,
                buttonAction: BUTTON_ACTION,
                actionId: ACTION_ID
              };
              message = this.processMessageWithActionId(PARAMS_TO_PROCESS);
            }
          }
          slackSessionProvider = await getSlackSessionProvider(PARAMS);
          await slackSessionProvider.handleIncomingMessageEvent(message, {}, {});
        }
        logger.info(`${MODULE_ID} --> handleButtonClickAction`, {
          payload,
          response,
        });
      }


    } catch (error) {
      const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
      logger.error('handleButtonClickAction', { ACA_ERROR });
      throw ACA_ERROR;
    }
  }

  async handleStaticSelectAction(payload, response) {
    const CONVERSATION_ID = conversationIdBySlackMessage(payload);
    const SLACK_CHANNEL = ramda.path(['channel', 'id'], payload);
    const SLACK_USER = ramda.path(['user', 'id'], payload);
    const TENANT = ramda.path(['tenant'], this.configuration);
    const ASSISTANT = ramda.path(['assistant'], this.configuration);
    const ENGAGEMENT = ramda.path(['engagement'], this.configuration);
    const MESSAGE_TIMESTAMP = ramda.path(['message', 'ts'], payload);
    const DROPDOWN_SELECTED_OPTION_ACTIONS = ramda.path(['actions', 0], payload);
    const DROPDOWN_SELECTED_OPTION_TEXT = ramda.path(['selected_option', 'value'], DROPDOWN_SELECTED_OPTION_ACTIONS);
    const SESSION_EXPIRATION_TIME_IN_SECONDS = retrieveSlackSessionExpirationTime(this.configuration);
    let message;
    let slackSessionProvider;
    try {
      if (
        !lodash.isEmpty(CONVERSATION_ID)
      ) {
        const PARAMS = {
          conversationId: CONVERSATION_ID,
          server: this,
          slack: {
            user: {
              id: SLACK_USER
            },
            channel: {
              id: SLACK_CHANNEL
            }
          },
          tenant: TENANT,
          assistant: ASSISTANT,
          engagement: ENGAGEMENT,
          messageTimestamp: MESSAGE_TIMESTAMP,
          sessionExpirationTimeInSeconds: SESSION_EXPIRATION_TIME_IN_SECONDS,
        };
        {
          message = slackInteractionMessage(payload);
          message.text = DROPDOWN_SELECTED_OPTION_TEXT;
        }
        slackSessionProvider = await getSlackSessionProvider(PARAMS);
        await slackSessionProvider.handleIncomingMessageEvent(message, {}, {});
      }
      logger.info(`${MODULE_ID} --> handleStaticSelectAction`, {
        payload,
        response,
      })

    } catch (error) {
      const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
      logger.error('handleStaticSelectAction', { ACA_ERROR });
      throw ACA_ERROR;
    }
  }

  processMessageWithActionId(params) {
    const MESSAGE = ramda.path(['message'], params);
    const BUTTON_ACTION_VALUE = ramda.path(['buttonAction', 'value'], params);
    const ACTION_ID = ramda.path(['actionId'], params);
    const SENDER_ACTION = {
      AI_SKILL_SELECTED: 'AI_SKILL_SELECTED',
      PI_CONFIRMATION: 'PI_CONFIRMATION'
    };
    let payload;
    let skill;
    let text;
    switch (ACTION_ID) {
      case BUTTON_ACTION_TYPE.SUGGESTION:
        payload = JSON.parse(BUTTON_ACTION_VALUE);
        skill = ramda.path(['skill'], payload);
        text = ramda.path(['userText'], payload);
        MESSAGE.sender_action = {
          aiSkill: skill,
          type: SENDER_ACTION.AI_SKILL_SELECTED
        };
        MESSAGE.text = text;
        break;
      case BUTTON_ACTION_TYPE.PI_AGREEMENT:
        payload = JSON.parse(BUTTON_ACTION_VALUE);
        MESSAGE.confirmations = {
          piAgreement: payload
        };
        MESSAGE.sender_action = {
          value: payload,
          type: SENDER_ACTION.PI_CONFIRMATION
        };
        MESSAGE.text = '';
        break
      default:
        break;
    }
    return MESSAGE;
  }
}


module.exports = {
  AcaSlackServer,
}
