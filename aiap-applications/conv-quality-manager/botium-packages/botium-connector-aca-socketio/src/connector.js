/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'botium-connector-aca-socketio-connector';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const lodash = require('@ibm-aca/aca-wrapper-lodash');
const ramda = require('@ibm-aca/aca-wrapper-ramda');

const io = require('socket.io-client')

const { getConfiguration } = require('@ibm-aiap/aiap-env-configuration-service');

const { deleteSession } = require('@ibm-aca/aca-utils-session');

const { formatIntoAcaError, throwAcaError, ACA_ERROR_TYPE, appendDataToError } = require('@ibm-aca/aca-utils-errors');
const { authorizeChatSession } = require('./authorize-chat-session');

const Capabilities = {
  BASE_URL: 'BASE_URL',
  SOCKET_IO_PATH: 'SOCKET_IO_PATH',
  SOCKET_IO_PORT: 'SOCKET_IO_PORT',
  SOCKET_IO_EVENT_USER_SAYS: 'SOCKET_IO_EVENT_USER_SAYS',
  SOCKET_IO_EVENT_BOT_SAYS: 'SOCKET_IO_EVENT_BOT_SAYS',
  SOCKET_IO_SEND_TEXT_FIELD: 'SOCKET_IO_SEND_TEXT_FIELD',
  SOCKET_IO_SEND_MEDIA_FIELD: 'SOCKET_IO_SEND_MEDIA_FIELD',
  SOCKET_IO_RECEIVE_TEXT_FIELD: 'SOCKET_IO_RECEIVE_TEXT_FIELD',
  SOCKET_IO_RECEIVE_ATACHMENT_FIELD: 'SOCKET_IO_RECEIVE_ATACHMENT_FIELD',
}

const IO_OPTIONS_QUERY_PARAM_KEYS = {
  X_ACA_CONVERSATION_TOKEN: 'x-aca-conversation-token',
}

const Defaults = {}

class BotiumConnectorAcaSocketIO {

  constructor(params) {
    this.queueBotSays = params?.queueBotSays;
    this.caps = params?.caps;
    this.gAcaProps = params?.envs?.gAcaProps;
    this.confirmations = params?.envs?.confirmations;
    this.conversationToken;
  }

  async Validate() {
    this.caps = Object.assign({}, Defaults, this.caps);
    if (
      !this.caps[Capabilities.BASE_URL]
    ) {
      const MESSAGE = `Missing required this.caps[Capabilities.BASE_URL] parameter!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }
    if (
      !this.caps[Capabilities.SOCKET_IO_EVENT_USER_SAYS]
    ) {
      const MESSAGE = `Missing required this.caps[Capabilities.SOCKET_IO_EVENT_USER_SAYS] parameter!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }
    if (
      !this.caps[Capabilities.SOCKET_IO_EVENT_BOT_SAYS]
    ) {
      const MESSAGE = `Missing required this.caps[Capabilities.SOCKET_IO_EVENT_BOT_SAYS] parameter!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }
  }

  async Build() {
    logger.info('Build', { this_gAcaProps: this.gAcaProps });
    this.socketOptions = {
      forceNew: true
    };
    if (this.caps[Capabilities.SOCKET_IO_PATH]) {
      this.socketOptions.path = this.caps[Capabilities.SOCKET_IO_PATH];
    }
    if (this.caps[Capabilities.SOCKET_IO_PORT]) {
      this.socketOptions.port = this.caps[Capabilities.SOCKET_IO_PATH];
    }
  }

  _onMessage(message) {
    logger.info('_onMessage', { message });
    const botMsg = {
      sender: 'bot',
      sourceData: message
    };
    botMsg.messageText = message?.message?.text;
    if (this.caps[Capabilities.SOCKET_IO_RECEIVE_ATACHMENT_FIELD]) {
      const dataUri = message[this.caps[Capabilities.SOCKET_IO_RECEIVE_ATACHMENT_FIELD]];
      if (dataUri && lodash.isString(dataUri) && dataUri.startsWith('data:')) {
        const mimeType = dataUri.substring(5, dataUri.indexOf(';'));
        const base64 = dataUri.substring(dataUri.indexOf(',') + 1);
        botMsg.attachments = [{
          mimeType,
          base64
        }];
      }
    }
    this.queueBotSays(botMsg)
  }

  async Start() {
    this.socket = io(this.caps[Capabilities.BASE_URL], this.socketOptions);

    logger.info('Start', {
      gAcaProps: this.gAcaProps,
      socket: {
        id: this.socket?.id
      }
    });

    this.socket.on('disconnect', (reason) => {
      logger.info('Start:on_disconnect', {
        gAcaProps: this.gAcaProps,
        socket: {
          id: this.socket?.id
        }
      });
    });
    this.socket.on(this.caps[Capabilities.SOCKET_IO_EVENT_BOT_SAYS], (message) => {
      const SENDER_ACTION = message?.sender_action;
      if (
        SENDER_ACTION !== 'typing_on'
      ) {
        this._onMessage(message);
      } else {
        logger.info('Start:typing_on:skipped', {
          gAcaProps: this.gAcaProps,
          socket: {
            id: this.socket?.id
          }
        });
      }
    });

    return new Promise((resolve, reject) => {

      this.socket.on('connect', () => {
        logger.info('Start:on_connect', {
          gAcaProps: this.gAcaProps,
          socket: {
            id: this.socket?.id
          }
        });
        // resolve();
      })
      this.socket.on('connect_error', (error) => {
        const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
        appendDataToError(ACA_ERROR, {
          gAcaProps: this.gAcaProps,
          socket: {
            id: this.socket?.id
          }
        });
        logger.error('Start:on_connect_error', { ACA_ERROR });
        reject(ACA_ERROR);
      })

      this.socket.on('error', (error) => {
        const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
        appendDataToError(ACA_ERROR, {
          gAcaProps: this.gAcaProps,
          socket: {
            id: this.socket?.id
          }
        });
        logger.error('Start:on_error', { ACA_ERROR });
        reject(ACA_ERROR);
      });

      this.socket.on('init', (conversationToken) => {
        logger.info('Start:on_init', {
          gAcaProps: this.gAcaProps,
          socket: {
            id: this.socket?.id
          },
          conversationToken: conversationToken,
        });
        this.socket.io.opts.query = {
          [IO_OPTIONS_QUERY_PARAM_KEYS.X_ACA_CONVERSATION_TOKEN]: conversationToken,
        };
        resolve();
      });
    })
  }

  async UserSays(message) {
    logger.info('UserSays:before', {
      gAcaProps: this.gAcaProps,
      socket: {
        id: this.socket?.id
      },
      message: message,
    });
    const args = {}

    if (
      this.caps[Capabilities.SOCKET_IO_SEND_TEXT_FIELD]
    ) {
      lodash.set(args, this.caps[Capabilities.SOCKET_IO_SEND_TEXT_FIELD], message.messageText);
    }

    if (
      this.caps[Capabilities.SOCKET_IO_SEND_MEDIA_FIELD]
    ) {
      if (
        message.media &&
        message.media.length > 0
      ) {
        const media = message.media[0];
        if (
          !media.buffer
        ) {
          return Promise.reject(new Error(`Media attachment ${media.mediaUri} not downloaded`))
        }
        lodash.set(args, this.caps[Capabilities.SOCKET_IO_SEND_MEDIA_FIELD], `data:${media.mimeType};base64,${media.buffer.toString('base64')}`)

        if (!message.attachments) {
          message.attachments = []
        }
        message.attachments.push({
          name: media.mediaUri,
          mimeType: media.mimeType,
          base64: media.buffer.toString('base64')
        })
      }
    }
    message.sourceData = {
      event: this.caps[Capabilities.SOCKET_IO_EVENT_USER_SAYS],
      args
    }
    args.gAcaProps = this.gAcaProps;
    args.confirmations = this.confirmations;
    args.engagement = this.engagement;
    args.message = {
      text: message.messageText,
      timestamp: new Date().getTime()
    }
    logger.info('UserSays:after', {
      gAcaProps: this.gAcaProps,
      socket: {
        id: this.socket?.id
      },
      message: message,
      args: args
    });
    this.socket.emit(this.caps[Capabilities.SOCKET_IO_EVENT_USER_SAYS], args)
  }

  async Stop() {
    logger.info('Stop', {
      gAcaProps: this.gAcaProps,
      socket: {
        id: this.socket?.id
      },
    });
    await this._closeSocket();
  }

  async Clean() {
    logger.info('Clean', {
      gAcaProps: this.gAcaProps,
      socket: {
        id: this.socket?.id
      },
    });
    await this._closeSocket()
  }

  async _closeSocket() {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
      await deleteSession(this.authorization);
    }
  }
}

module.exports = BotiumConnectorAcaSocketIO
