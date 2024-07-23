/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-bot-rest-api-bot-rest-api-index';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const bodyParser = require('body-parser');
const EventEmitter = require('events');

import ramda from '@ibm-aca/aca-wrapper-ramda';

import {
  formatIntoAcaError,
} from '@ibm-aca/aca-utils-errors';

import {
  ISoeUpdateV1,
  ISoeOutgoingMessageFormattedV1,
  ISoeSendMessageOptionsV1,
} from '@ibm-aiap/aiap--types-soe';

import {
  OutgoingMessage,
} from '@ibm-aiap/aiap-soe-engine';

import {
  SoeBotV1,
} from '@ibm-aiap/aiap-soe-bot';

import {
  MessageUtils,
} from '../message-utils';

import {
  cleanMessagesStack,
} from './clean-messages-stack';

import {
  CONSTANTS,
} from './constants';

import {
  formatUpdate,
} from './format-update';

const RESPONSE_EMITTER = new EventEmitter();

class BotRestApi extends SoeBotV1 {

  app: any;
  sessionStore: any;

  constructor(
    settings,
    app,
    sessionStore,
  ) {
    super(settings);
    this.app = app;
    this.sessionStore = sessionStore;
    this.__applySettings(settings);
    this.__createMountPoints();
  }

  __applySettings(settings) {
    super.__applySettings(settings);

    this.type = CONSTANTS.CHAT_API_BOT_TYPE;
    this.id = `${this.type}-${settings.id}`;

    this.receives = settings.receives || {
      text: true,
    };

    this.sends = settings.sends || {
      text: true,
    };
  }

  __createMountPoints() {
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: true }));

    this.app.post(CONSTANTS.UPDATE_MESSAGE_PATH, async (req, res) => this.postMessage(req, res));
    this.app.get(CONSTANTS.GET_MESSAGE_PATH, async (req, res) => this.getMessage(req, res));
    this.app.post(CONSTANTS.TYPING_EVENT_PATH, async (req, res) => this.postAgentTypingStatus(req, res));
    this.app.post(CONSTANTS.PING_PONG_PATH, (req, res) => this.pingPongMessage(req, res));
  }

  async postMessage(
    request: any,
    response: any,
  ) {
    const conversationId = request.body.conversationId;
    const formattedUpdate = formatUpdate(conversationId, this.id, request);

    const MESSAGES_STACK = await this.sessionStore.getData(CONSTANTS.MESSAGE_STACK_PREFIX + conversationId);

    MESSAGES_STACK.last_message_timestamp = formattedUpdate.message.incoming_timestamp;

    await this.sessionStore.setData(CONSTANTS.MESSAGE_STACK_PREFIX + conversationId, MESSAGES_STACK);

    this.__emitUpdate(formattedUpdate);

    response.status(200).json({
      conversationId: conversationId,
    });
  }


  pingPongMessage(
    request,
    response,
  ) {
    const conversationId = request.body.conversationId;
    const formattedUpdate = formatUpdate(conversationId, this.id, request, true);

    RESPONSE_EMITTER.once(CONSTANTS.PING_PONG_PREFIX + conversationId, formattedResponse => {
      response.status(200).json({
        conversationId: formattedResponse.recipient.id.replace(CONSTANTS.PING_PONG_PREFIX, ''),
        message: {
          text: formattedResponse.message.text,
        },
      });
    });

    this.__emitUpdate(formattedUpdate);
  }

  async respond(
    params: {
      update,
      message,
    },
  ) {
    let retVal;
    try {
      if (
        this.__isAction(params)
      ) {
        retVal = await this.__respondWithAction(params);
      } else if (
        this.__isAttachment(params)
      ) {
        retVal = await this.__respondWithAttachment(params);
      } else {
        retVal = await this.__respondWithTextMessage(params);
      }
      return retVal;
    } catch (error) {
      const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
      logger.error(this.respond.name, { ACA_ERROR });
      throw ACA_ERROR;
    }
  }

  async getMessage(
    request: any,
    response: any,
  ) {

    let tmpResponse;
    try {
      const CONVERSATION_ID = request.params.conversationId;
      const AGENT_TYPING = await this.sessionStore.getData(CONSTANTS.AGENT_TYPING_PREFIX + CONVERSATION_ID);
      if (
        !AGENT_TYPING.status
      ) {
        AGENT_TYPING.status = 'off';
      }
      let messagesStack = await this.sessionStore.getData(CONSTANTS.MESSAGE_STACK_PREFIX + CONVERSATION_ID);
      if (
        !messagesStack.messages
      ) {
        messagesStack.messages = [];
      } else {
        messagesStack.messages = ramda.sortWith([ramda.ascend(ramda.path(['traceId', 'outgoing_timestamp']))])(
          messagesStack.messages
        );
      }
      messagesStack = cleanMessagesStack(messagesStack);
      if (
        messagesStack.messages.length > 0 &&
        (
          AGENT_TYPING.status &&
          AGENT_TYPING.status === 'off'
        )
      ) {
        const MESSAGE_OBJECT = messagesStack.messages[0];
        messagesStack.messages.shift();
        await this.sessionStore.setData(CONSTANTS.MESSAGE_STACK_PREFIX + CONVERSATION_ID, messagesStack)
        tmpResponse = ramda.mergeRight(
          {
            conversationId: CONVERSATION_ID,
            // TODO: remove transfer backwards compatibility as soon as new data model will be in use
            transfer: MESSAGE_OBJECT.action && MESSAGE_OBJECT.action.type === 'transfer' ? true : undefined,
          },
          {
            message: MESSAGE_OBJECT.message ? MESSAGE_OBJECT.message : undefined,
            action: MESSAGE_OBJECT.action,
          }
        );
      } else {
        tmpResponse = {
          conversationId: CONVERSATION_ID,
        };
      }
      response.status(200).json(tmpResponse);
    } catch (error) {
      const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
      response.status(500).send({ error: ACA_ERROR });
    }
  }

  async postAgentTypingStatus(req, res) {
    const conversationId = req.params.conversationId;

    const DEFAULT_OBJECT = {
      status: req.body.status,
    };

    this.sessionStore.setData(CONSTANTS.AGENT_TYPING_PREFIX + conversationId, DEFAULT_OBJECT).then(() => {
      return res.status(200).json(DEFAULT_OBJECT);
    });
  }

  getTraceId(
    update: ISoeUpdateV1,
  ) {
    let agentId;
    let conversationId;
    try {
      agentId = this.__getAgentId();
      conversationId = this.__getConversationId(update);
      const RET_VAL = ramda.mergeRight(
        update ? update.traceId || {} : {},
        {
          agentId,
          conversationId,
        }
      );
      return RET_VAL;
    } catch (error) {
      const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
      logger.error(this.getTraceId.name, { ACA_ERROR });
      throw ACA_ERROR;
    }
  }

  async transfer(
    message: any,
  ) {
    try {
      message = ramda.dissocPath(['message', 'text'], message);
      message.action = {
        type: 'transfer'
      };
      const RET_VAL = await this.__sendMessage(message);
      return RET_VAL;
    } catch (error) {
      const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
      logger.error('transfer', { ACA_ERROR });
      throw ACA_ERROR;
    }
  }

  __getAgentId() {
    return this.id;
  }

  __getConversationId(message) {
    const RET_VAL = message?.sender?.id || message?.recipient?.id || 'N/A';
    return RET_VAL;
  }

  // TODO --> LEGO --> 2023-09-19 --> Seems to be unused
  // __matchSkill(chatSessionId, skills, index) {
  //   return Promise.resolve(skills[index]);
  // }

  async __formatOutgoingMessage(
    outgoingMessage: OutgoingMessage,
    sendOptions: ISoeSendMessageOptionsV1,
  ) {
    const RET_VAL = outgoingMessage as ISoeOutgoingMessageFormattedV1;
    return RET_VAL;
  }

  async __sendMessage(formattedMessage) {
    try {
      const conversationId = formattedMessage.recipient.id;
      if (
        conversationId.includes(CONSTANTS.PING_PONG_PREFIX)
      ) {
        RESPONSE_EMITTER.emit(conversationId, formattedMessage);
      } else {
        const MESSAGES_STACK = await this.sessionStore.getData(CONSTANTS.MESSAGE_STACK_PREFIX + conversationId);
        if (
          !MESSAGES_STACK.messages
        ) {
          MESSAGES_STACK.messages = [];
        }
        if (
          formattedMessage.traceId.incoming_timestamp >= MESSAGES_STACK.last_message_timestamp
        ) {
          formattedMessage.traceId.outgoing_timestamp = new Date().getTime();

          MESSAGES_STACK.messages.push(formattedMessage);

          this.sessionStore.setData(CONSTANTS.MESSAGE_STACK_PREFIX + conversationId, MESSAGES_STACK).then(() => {
            logger.debug('Messages stack updated: ', conversationId, JSON.stringify(MESSAGES_STACK));
          });
        }
      }
    } catch (error) {
      const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
      logger.error(this.__sendMessage.name, { ACA_ERROR });
      throw ACA_ERROR;
    }
  }

  async __save(update, message) {
    try {
      message.traceId = update.traceId;
      if (
        !message.recipient || !message.recipient.id
      ) {
        message.recipient = {
          id: update.sender.id
        };
      }
      await this.__sendMessage(message);
    } catch (error) {
      const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
      logger.error(this.__save.name, { ACA_ERROR });
      throw ACA_ERROR;
    }
  }

  __closeConversation(
    update?: ISoeUpdateV1 | undefined,
    reason?: any
  ): Promise<void> {
    throw new Error('Method not implemented.');
  }
  __sendMessageAsText(
    params: {
      update: any,
      message: any,
    }
  ): Promise<any> {
    throw new Error('Method not implemented.');
  }
  __getUserInfo(
    userId: string,
    options: { [key: string]: any;[key: number]: any;[key: symbol]: any; }
  ) {
    throw new Error('Method not implemented.');
  }

  async __respondWithAction(
    params: {
      update: any,
      message: any,
    }
  ) {
    const RET_VAL = await this.__save(
      params?.update,
      params?.message,
    );
    return RET_VAL;
  }

  async __respondWithAttachment(
    params: {
      update: any,
      message: any,
    },
  ) {
    const MESSAGE_UTILS = new MessageUtils(this);
    await MESSAGE_UTILS.processOutgoingMessage(params?.update, params?.message);
  }

  async __respondWithTextMessage(
    params: {
      update: any,
      message: any,
    },
  ) {
    let retVal;
    try {
      const conversationId = params?.message.recipient.id;
      if (
        conversationId.includes(CONSTANTS.PING_PONG_PREFIX)
      ) {
        RESPONSE_EMITTER.emit(conversationId, params?.message);
      } else {
        retVal = await this.__save(params?.update, params?.message);
      }
      return retVal;
    } catch (error) {
      const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
      logger.error(this.__respondWithTextMessage.name, { ACA_ERROR });
      throw ACA_ERROR;
    }
  }

  async __retrieveRecipientId(
    outgoingMessage: OutgoingMessage,
    outgoingMessageFormatted: any,
  ): Promise<string> {
    throw new Error('Method not implemented.');
  }

  async __retrieveMessageId(
    outgoingMessage: OutgoingMessage,
    outgoingMessageFormatted: any,
  ): Promise<string> {
    throw new Error('Method not implemented.');
  }

}

export {
  BotRestApi,
}
