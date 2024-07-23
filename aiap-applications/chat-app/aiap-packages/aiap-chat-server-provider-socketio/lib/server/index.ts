/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-chat-server-provider-socketio-server';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import lodash from '@ibm-aca/aca-wrapper-lodash';

const io = require('socket.io');

import { formatIntoAcaError, appendDataToError } from '@ibm-aca/aca-utils-errors';
import { getSocketIORedisAdapter } from '@ibm-aca/aca-socket-io-provider';

import { ChatServerV1 } from '@ibm-aiap/aiap-chat-app--types';

import { getLibConfiguration } from '../configuration';
import { ChatServerV1SessionProviderSocketio } from '../server-session-provider';

class ChatServerV1Socketio extends ChatServerV1 {

  ioServerOptions: any;
  ioServer: any;

  constructor(server) {
    super();
    const LIB_CONFIGURATION = getLibConfiguration();
    this.ioServerOptions = LIB_CONFIGURATION?.ioSessionProvider?.server;
    this.ioServerOptions.cookie = {
      name: 'JSESSIONID',
      sameSite: 'none'
    };
    this._setSocketIOServer(server);
  }

  _setSocketIOServer(server) {
    this.ioServer = io(server, this.ioServerOptions);
    this._setRedisAdapter();
    this._setSocketIOListeners();
  }

  _setRedisAdapter() {
    const ADAPTER = getSocketIORedisAdapter();
    if (ADAPTER) {
      this.ioServer.adapter(ADAPTER);
      this.ioServer.of('/').adapter.on('error', (error) => {
        const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
        logger.error(this._setRedisAdapter.name, { ACA_ERROR });
      });
    }
  }

  onClearRoomEvent(
    sessionProvider: ChatServerV1SessionProviderSocketio
  ) {
    const RET_VAL = async (message) => {
      try {
        await sessionProvider.handleEventClearRoom(message);
      } catch (error) {
        const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
        logger.error(this.onClearRoomEvent.name, { ACA_ERROR });
        throw ACA_ERROR;
      }
    };
    return RET_VAL;
  }

  onMessageEvent(
    sessionProvider: ChatServerV1SessionProviderSocketio
  ) {
    const RET_VAL = async (message) => {
      try {
        await sessionProvider.handleEventIncomingMessage(message);
      } catch (error) {
        const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
        logger.error(this.onMessageEvent.name, { ACA_ERROR });
        throw ACA_ERROR;
      }
    }
    return RET_VAL;
  }

  onAudioMessageEvent(
    sessionProvider: ChatServerV1SessionProviderSocketio
  ) {
    const RET_VAL = async (audioMessage) => {
      try {
        await sessionProvider.handleEventIncomingMessageAudio(audioMessage);
      } catch (error) {
        const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
        logger.error(this.onAudioMessageEvent.name, { ACA_ERROR });
        throw ACA_ERROR;
      }
    }
    return RET_VAL;
  }

  onDisconnectFromWidgetEvent(
    sessionProvider: ChatServerV1SessionProviderSocketio
  ) {
    const RET_VAL = async () => {

      try {
        await sessionProvider.handleEventDisconnectFromWidget();
      } catch (error) {
        const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
        logger.error(this.onDisconnectFromWidgetEvent.name, { ACA_ERROR });
        throw ACA_ERROR;
      }
    }
    return RET_VAL;
  }

  onDisconnectEvent(
    sessionProvider: ChatServerV1SessionProviderSocketio
  ) {
    const RET_VAL = async (reason) => {
      try {
        await sessionProvider.handleEventDisconnectClientSide();
      } catch (error) {
        const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
        appendDataToError(ACA_ERROR, {
          socket: {
            id: sessionProvider?.socket?.id,
          },
          reason: reason
        });
        logger.error(this.onDisconnectEvent.name, { ACA_ERROR });
        throw ACA_ERROR;
      }
    }
    return RET_VAL;
  }

  onUserTypingEvent(
    sessionProvider: ChatServerV1SessionProviderSocketio
  ) {
    const RET_VAL = async (status) => {
      try {
        await sessionProvider.handleEventUserTyping(status);
      } catch (error) {
        const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
        appendDataToError(ACA_ERROR, {
          socket: {
            id: sessionProvider?.socket?.id,
          },
          status: status
        });
        logger.error(this.onUserTypingEvent.name, { ACA_ERROR });
        throw ACA_ERROR;
      }
    }
    return RET_VAL;
  }

  _setSocketIOListeners() {
    this.ioServer.on('connection', async (socket) => {
      logger.info(`NEW_CONNECTION_EVENT`);
      const SOCKET_IO_SESSION_PROVIDER = await ChatServerV1SessionProviderSocketio.getInstance(this, socket);

      socket.on('clear_room', this.onClearRoomEvent(SOCKET_IO_SESSION_PROVIDER));
      socket.on('message', this.onMessageEvent(SOCKET_IO_SESSION_PROVIDER));
      socket.on('audioMessage', this.onAudioMessageEvent(SOCKET_IO_SESSION_PROVIDER));
      socket.on('disconnectFromWidget', this.onDisconnectFromWidgetEvent(SOCKET_IO_SESSION_PROVIDER));
      socket.on('disconnect', this.onDisconnectEvent(SOCKET_IO_SESSION_PROVIDER));
      socket.on('user_typing', this.onUserTypingEvent(SOCKET_IO_SESSION_PROVIDER));
    });
  }


  _getRoomsMap() {
    let retVal;
    if (
      this.ioServer &&
      this.ioServer.sockets &&
      this.ioServer.sockets.adapter &&
      this.ioServer.sockets.adapter.rooms
    ) {
      retVal = this.ioServer.sockets.adapter.rooms;
    }
    return retVal;
  }

  getRoom(roomId) {
    let retVal = undefined;
    const ROOMS_MAP = this._getRoomsMap();
    if (
      lodash.isString(roomId) &&
      !lodash.isEmpty(roomId) &&
      ROOMS_MAP
    ) {
      retVal = ROOMS_MAP.get(roomId);

    }
    return retVal;
  }

}

export {
  ChatServerV1Socketio,
}
