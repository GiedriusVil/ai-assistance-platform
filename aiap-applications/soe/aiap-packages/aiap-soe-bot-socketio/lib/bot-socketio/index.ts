/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-bot-socketio-bot-socketio';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const urlParser = require('url');

import ramda from '@ibm-aca/aca-wrapper-ramda';
import lodash from '@ibm-aca/aca-wrapper-lodash';

import {
  appendDataToError,
  formatIntoAcaError,
  throwAcaError,
  ACA_ERROR_TYPE,
} from '@ibm-aca/aca-utils-errors';

import {
  ISoeOutgoingMessageFormattedV1,
  ISoeSendMessageOptionsV1,
} from '@ibm-aiap/aiap--types-soe';

import {
  OutgoingMessage
} from '@ibm-aiap/aiap-soe-engine';

import {
  SoeBotV1,
} from '@ibm-aiap/aiap-soe-bot';

import {
  setupSocketIoServer,
} from './socketio/server';

import * as adapterUtils from './utils';
import * as chatEvents from './socketio/events/chat-events';

export * from './setup-bot-socketio-auth';

export class BotSocketIo extends SoeBotV1 {

  typingStatus: any;
  clientSockets: any;

  utilsActivity: any;
  utilsTyping: any;

  ioServer: any;

  constructor(
    params: any,
  ) {
    super(params);
    this.implements = {
      concierge: false,
      tagReplace: false,
      structuredMessage: true,
      typing: true,
      video: true,
      close: true,
    };
    this.actions = {};
    this.useEngagements = false;

    this.typingStatus = {};
    this.clientSockets = {};

    this.type = 'SOCKET.IO';


    this.applySettings(params?.settings);
    setupSocketIoServer({ adapter: this });

    this.utilsActivity = new adapterUtils.UtilsActivity(this);
    this.utilsTyping = new adapterUtils.UtilsTyping(this);

  }

  async __closeConversation(update, reason) {
    const closeReason = reason ? reason : 'close';

    //Check if already closing
    const clientActivity = await this.utilsActivity.getClientActivity(update.sender.id);
    if (this.utilsActivity.isChatInClosingState(clientActivity)) return;

    const clientSocket = this.getClientSocket(update.sender.id);
    if (clientSocket == null) {
      logger.warn(`__closeConversation action with reason ${closeReason} will fail`);
      return;
    }
    logger.info(`${MODULE_ID} -> closing conversation for client ${update.sender.id}. Reason: ${closeReason}`);
    chatEvents.close.send(clientSocket, this, closeReason);
    this.utilsActivity.setClosingState(update.sender.id, clientActivity);
  }

  async __formatOutgoingMessage(
    outgoingMessage: OutgoingMessage,
    sendOptions: ISoeSendMessageOptionsV1,
  ) {
    const RET_VAL = outgoingMessage as ISoeOutgoingMessageFormattedV1;
    return RET_VAL;
  }

  async __retrieveRecipientId(
    outgoingMessage: OutgoingMessage,
    outgoingMessageFormatted: any
  ): Promise<string> {
    const RET_VAL = outgoingMessageFormatted?.recipient?.id;
    return RET_VAL;
  }

  async __retrieveMessageId(
    outgoingMessage: OutgoingMessage,
    outgoingMessageFormatted: any,
  ): Promise<string> {
    const TIMESTAMP = Math.floor(Date.now());
    const RET_VAL = `${this.id}.${outgoingMessageFormatted.recipient.id}.${String(TIMESTAMP)}`;
    return RET_VAL;
  }

  __formatUpdate(raw, clientId) {
    let timestamp;

    let sender;
    let recipient;
    let channel;
    let traceId;

    let retVal;
    try {
      timestamp = Math.floor(Date.now());
      sender = {
        id: clientId,
      };
      recipient = {
        id: this.id,
      };
      channel = {
        id: this.type,
      }
      retVal = {
        timestamp,
        raw,
        sender,
        recipient,
        channel,
        traceId,
      };
      retVal.traceId = this.getTraceId(retVal);
      return retVal;
    } catch (error) {
      const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
      logger.error(this.__formatUpdate.name, { ACA_ERROR });
      throw ACA_ERROR;
    }
  }

  async __sendMessage(
    outgoingMessageFormmated: any,
    options?: ISoeSendMessageOptionsV1,
  ) {
    let clientActivity;
    try {
      clientActivity = await this.utilsActivity.getClientActivity(outgoingMessageFormmated.recipient.id);

      if (
        this.utilsActivity.isChatInClosingState(clientActivity)
      ) {
        const ERROR_MESSAGE = `In closing state!`
        throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, ERROR_MESSAGE);
      }
      this.ioServer.to(outgoingMessageFormmated.recipient.id).emit('message', outgoingMessageFormmated);
      this.utilsActivity.updateClientActivity(outgoingMessageFormmated.recipient.id, clientActivity);

    } catch (error) {
      const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
      logger.error(this.__sendMessage.name, { ACA_ERROR });
      throw ACA_ERROR;
    }
  }

  applySettings(settings) {
    super.__applySettings(settings);

    if (
      lodash.isEmpty(settings?.id)
    ) {
      const ERROR_MESSAGE = `Missing required settings?.id parameter!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, ERROR_MESSAGE);
    }
    this.id = settings.id;

    this.receives = settings.receives || {
      text: true,
      attachment: {
        audio: false,
        file: false,
        image: false,
        video: false,
        location: false,
        fallback: false,
      },
      echo: false,
      read: false,
      delivery: true,
      postback: false,
      quickReply: true,
    };

    this.sends = settings.sends || {
      text: true,
      quickReply: true,
      locationQuickReply: false,
      senderAction: {
        typingOn: true,
        typingOff: true,
        markSeen: false,
      },
      attachment: {
        audio: false,
        file: false,
        image: false,
        video: false,
      },
    };
  }

  getClientId(socket) {
    const urlObject = urlParser.parse(socket.request.url, true);
    const clientId = urlObject.query.clientId || socket.id;
    return clientId;
  }

  /**
   * Removies all client specific data from adapter
   * @param clientId
   */
  clientCleanupFromAdapter(clientId) {
    this.utilsActivity.removeClientActivityTimers(clientId);
    this.utilsTyping.removeFromTypingStatus(clientId);
    this.removeClientSocket(clientId);
  }

  //Typing
  getTyping(clientId) {
    return this.utilsTyping.getTyping(clientId);
  }

  getClientSocketId(clientId) {
    return this.clientSockets[clientId];
  }

  setClientSocketId(clientId, socketId) {
    this.clientSockets[clientId] = socketId;
  }

  getClientSocket(clientId) {
    try {
      const socketId = this.getClientSocketId(clientId);
      if (socketId == undefined) {
        logger.warn(`Client with id: ${clientId} does not have socket.id.`);
        return undefined;
      }
      const SOCKETS = this.ioServer?.sockets?.sockets;
      let socket;
      if (
        lodash.isMap(SOCKETS)
      ) {
        socket = SOCKETS.get(socketId);
      }
      if (socket == undefined) {
        logger.warn(`Socket with id: ${socketId} does not exist in socket.io server.`);
        return undefined;
      }
      return socket;
    } catch (error) {
      const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
      appendDataToError(ACA_ERROR, { clientId });
      logger.error(this.getClientSocket.name, { ACA_ERROR });
      throw ACA_ERROR;
    }
  }

  removeClientSocket(clientId) {
    this.clientSockets = ramda.dissoc(clientId, this.clientSockets);
  }

  __getAgentId() {
    return this.settings?.agent || 'socketio';
  }


  __getConversationId(update) {
    const RET_VAL = update?.sender?.id || update?.recipient?.id || 'N/A';
    return RET_VAL;
  }

  __respondWithAction(
    message: any
  ): Promise<void> {
    throw new Error('Method not implemented.');
  }
  __respondWithAttachment(
    message: any
  ): Promise<any> {
    throw new Error('Method not implemented.');
  }
  __sendMessageAsText(
    message: any
  ): Promise<any> {
    throw new Error('Method not implemented.');
  }
  __getUserInfo(
    userId: string,
    options: {
      [key: string]: any;[key: number]: any;[key: symbol]: any;
    }) {
    throw new Error('Method not implemented.');
  }
}

