/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-chat-channel-socketio-channel-socketio';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import lodash from '@ibm-aca/aca-wrapper-lodash';

import {
  throwAcaError,
  ACA_ERROR_TYPE,
  formatIntoAcaError,
  appendDataToError,
} from '@ibm-aca/aca-utils-errors';

const io = require('socket.io-client');

import { uuidv4 } from '@ibm-aca/aca-wrapper-uuid';

import {
  storeSession,
} from '@ibm-aca/aca-utils-session';

import {
  IChatMessageV1,
  IChatServerSessionV1,
  ChatChannelV1,
  ChatServerV1SessionProvider,
  ChatServerV1,
} from '@ibm-aiap/aiap-chat-app--types';

import {
  IChatChannelV1SocketioConfiguration,
} from '../types';

const HANDOVER_TYPE = {
  TRANSFER: 'transfer',
  TRANSFER_ON_CLIENT_SIDE: 'transfer_on_client_side',
  TRANSFER_TO_BOT: 'transfer_to_bot',
};

class ChatChannelV1Socketio extends ChatChannelV1<IChatChannelV1SocketioConfiguration> {

  botSocket: any;

  constructor(
    id: string,
    chatServerSessionProvider: ChatServerV1SessionProvider<ChatServerV1, ChatChannelV1Socketio>,
    configuration: IChatChannelV1SocketioConfiguration,
  ) {
    super(id, chatServerSessionProvider, configuration);
    this.type = 'socketio';
  }

  async __init(params: any) {
    try {
      if (
        !this.chatServerSessionProvider
      ) {
        const ERROR_MESSAGE = 'Missing required this.chatServerSessionProvider attribute!';
        throwAcaError(MODULE_ID, ACA_ERROR_TYPE.INITIALIZATION_ERROR, ERROR_MESSAGE);
      }
      if (
        !this.chatServerSessionProvider.session
      ) {
        const ERROR_MESSAGE = 'Missing required this.chatServerSessionProvider.session attribute!';
        throwAcaError(MODULE_ID, ACA_ERROR_TYPE.INITIALIZATION_ERROR, ERROR_MESSAGE);
      }
      if (
        lodash.isEmpty(this.configuration?.external?.url)
      ) {
        const ERROR_MESSAGE = 'Missing required this.configuration.external.url attribute!';
        throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, ERROR_MESSAGE);
      }
      if (
        lodash.isEmpty(this.configuration?.external?.path)
      ) {
        const ERROR_MESSAGE = 'Missing required this.configuration.external.path attribute'
        throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, ERROR_MESSAGE);
      }

      const STORED_CHANNEL_CONV_ID = params?.session?.conversation?.id;
      if (
        STORED_CHANNEL_CONV_ID &&
        !lodash.isEmpty(STORED_CHANNEL_CONV_ID)
      ) {
        this.conversationId = STORED_CHANNEL_CONV_ID;
      } else {
        this.conversationId = uuidv4();
      }

      const IO_QUERY = {
        clientId: this.conversationId,
      };

      const URL = this.configuration?.external?.url;
      const PATH = this.configuration?.external?.path;
      const TRANSPORTS = this.configuration?.external?.transports;

      const IO_OPTIONS = {
        path: PATH,
        query: IO_QUERY,
        transports: TRANSPORTS,
        reconnection: true,
        rejectUnauthorized: false
      };
      this.botSocket = io(URL, IO_OPTIONS);
      this.setChatListeners();
      this.botSocket.connect();
    } catch (error) {
      const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
      logger.error(this.__init.name, { ACA_ERROR });
      throw ACA_ERROR;
    }
  }

  async startChat(
    session: IChatServerSessionV1,
    notify = false
  ) {
    try {
      const INIT_PARAMS = {
        session: session,
        reconnect: false,
      };
      await this.__init(INIT_PARAMS);
      // Probably we need some other approach here
      if (
        notify
      ) {
        const MESSAGE: IChatMessageV1 = {
          id: uuidv4(),
          type: 'SYSTEM',
          message: {
            text: '§§TRANSFER_BACK',
            timestamp: new Date().getTime(),
          },
          engagement: session?.engagement,
          gAcaProps: session?.gAcaProps,

        };
        this.sendMessage(MESSAGE);
      }

      const RET_VAL = {
        conversationId: this.conversationId,
        conversationIdExternal: this.conversationIdExternal,
      };
      return RET_VAL;
    } catch (error) {
      const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
      logger.error(this.startChat.name, { ACA_ERROR });
      throw ACA_ERROR;
    }
  }

  async continueChat(
    session: IChatServerSessionV1,
  ) {
    try {
      const INIT_PARAMS = {
        session: session,
        reconnect: true,
      };
      await this.__init(INIT_PARAMS);
      const RET_VAL = {
        conversationId: this.conversationId,
        conversationIdExternal: this.conversationIdExternal,
      };
      return RET_VAL;
    } catch (error) {
      const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
      logger.error(this.continueChat.name, { ACA_ERROR });
      throw ACA_ERROR;
    }
  }

  setChatListeners() {
    this.botSocket.on('connect', () => {
      if (
        this.botSocket.id
      ) {
        logger.info(`${this.setChatListeners.name} --> connect`, {
          this_botSocket_id: this.botSocket.id
        });
      }
    });
    this.botSocket.on('ping', () => {
      this.botSocket.emit('pong', { beat: 1 });
    });
    this.botSocket.on('error', (error) => {
      if (
        error
      ) {
        this.chatServerSessionProvider.emit('bot_status', { status: 'offline' });
      }
      logger.error(`${this.setChatListeners.name} --> error`, { error });

    });
    this.botSocket.on('reconnect_error', error => {
      logger.error(`${this.setChatListeners.name} --> reconnect_error`, {
        this_configuration_external_url: this.configuration?.external?.url,
        this_configuration_external_path: this.configuration?.external?.path,
        error: error,
      });
    });
    this.botSocket.on('reconnect_attempt', attempt => {
      if (
        attempt === this.configuration?.external?.reconnectionAttempts
      ) {
        this.chatServerSessionProvider.emit('bot_status', { status: 'offline' });
      }
      logger.error(`${this.setChatListeners.name} --> reconnect_attempt`, { attempt });
    });
    this.botSocket.on('message', async (message) => {
      let soeSocketIdServer;
      let soeSocketIdClient;
      let appSocketId;

      let messageSenderAction;
      try {
        soeSocketIdServer = message?.traceId?.soeSocketIdServer;
        soeSocketIdClient = this.botSocket?.id;
        appSocketId = this.chatServerSessionProvider?.id;
        if (
          soeSocketIdServer !== soeSocketIdClient
        ) {
          // [LEGO] Skipping processing of this message - wrong receiver!
          return;
        }
        messageSenderAction = message?.sender_action;
        if (
          messageSenderAction &&
          messageSenderAction?.type == HANDOVER_TYPE.TRANSFER
        ) {
          await this.chatServerSessionProvider.handleEventTransfer(message);

        } else if (
          messageSenderAction &&
          messageSenderAction?.type == HANDOVER_TYPE.TRANSFER_ON_CLIENT_SIDE
        ) {
          await this.chatServerSessionProvider.handleClientTransferOnClientSide(message);

        } else if (
          messageSenderAction &&
          messageSenderAction?.type == HANDOVER_TYPE.TRANSFER_TO_BOT
        ) {
          await this.chatServerSessionProvider.handleEventTransferToBot(message);
        } else {
          await this.chatServerSessionProvider.sendOutgoingMessage(message);
        }

      } catch (error) {
        const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
        appendDataToError(ACA_ERROR, {
          appSocketId,
          soeSocketIdClient,
          soeSocketIdServer,
          messageSenderAction,
        });
        logger.error(`${this.setChatListeners.name} --> on_message`, { ACA_ERROR });
        throw ACA_ERROR;
      }
    });
    this.botSocket.on('disconnect', async (reason) => {
      let appSocketId;
      let botSocketId;
      try {
        appSocketId = this.chatServerSessionProvider?.id;
        botSocketId = this.botSocket?.id;
        await this.processBotDisconnect();
      } catch (error) {
        const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
        appendDataToError(ACA_ERROR, {
          reason,
          appSocketId,
          botSocketId,
        });
        logger.error(`${this.setChatListeners.name} --> disconnect`, { ACA_ERROR });
        throw ACA_ERROR;
      }
    });
  }

  async processBotDisconnect() {
    if (
      this.chatServerSessionProvider
    ) {
      this.chatServerSessionProvider.disconnect();
    }
  }

  async sendMessage(message: IChatMessageV1) {
    try {
      logger.info(this.sendMessage.name,
        {
          this_botSocket_id: this.botSocket.id
        });
      if (
        message?.engagement?.chatAppServer
      ) {
        delete message?.engagement?.chatAppServer
      }

      if (message?.message?.sender_action?.type === 'LANGUAGE_CHANGE') {
        const MESSAGE = {
          id: uuidv4(),
          type: 'bot',
          message: {
            text: message?.message?.sender_action?.data,
          },
        };
        if (this.chatServerSessionProvider.session?.gAcaProps?.userSelectedLanguage) {
          this.chatServerSessionProvider.session.gAcaProps.userSelectedLanguage = message?.gAcaProps?.userSelectedLanguage;
          await storeSession(this.chatServerSessionProvider.session);
        }
  
        return await this.chatServerSessionProvider.sendOutgoingMessage(MESSAGE);
      }

      this.botSocket.send(message);
    } catch (error) {
      const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
      logger.error(this.sendMessage.name, { ACA_ERROR });
      throw ACA_ERROR;
    }
  }

  async disconnect() {
    this.chatServerSessionProvider = undefined;
    if (
      this.botSocket
    ) {
      await this.botSocket.disconnect();
    }
  }

  async handleClientSideDisconnect() {
    await this.disconnect();
  }

  async sendUserTyping(status) {
    logger.info('sendUserTyping not implemented', { status: status });
  }

}

export {
  ChatChannelV1Socketio,
};
