/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-chat-server-provider-socketio-session-providers-socket-io-session-provider';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import lodash from '@ibm-aca/aca-wrapper-lodash';

import {
  formatIntoAcaError,
} from '@ibm-aca/aca-utils-errors';

import {
  IChatMessageV1,
  IChatChannelV1Configuration,
  ChatServerV1SessionProvider,
} from '@ibm-aiap/aiap-chat-app--types';

import {
  deleteSession,
  refreshToken,
} from '@ibm-aca/aca-utils-session';

import { ChatChannelV1 } from '@ibm-aiap/aiap-chat-app--types';

import { ChatServerV1Socketio } from '../server';

import { _assignEventEmitterSTTAndListeners } from './assign-event-emitter-stt-and-listeners';
import { _assignEventEmitterTTSAndListeners } from './assign-event-emitter-tts-and-listeners'
import { _assignSession } from './assign-session';
import { _clearRoom } from './clear-room';
import { _continueChat } from './continue-chat';

import { _handleEventClearRoom } from './handle-event-clear-room';

import { _handleEventDisconnectClientSide } from './handle-event-disconnect-client-side';
import { _handleEventDisconnectFromWidget } from './handle-event-disconnect-from-widget';
import { _handleEventDisconnect } from './handle-event-disconnect';

import { _handleEventIncomingMessageAudioTranscribed } from './handle-event-incoming-message-audio-transcribed';
import { _handleEventIncomingMessageAudio } from './handle-event-incoming-message-audio';
import { _handleEventIncomingMessage } from './handle-event-incoming-message';

import { _handleEventOutgoingMessageAudio } from './handle-event-outgoing-message-audio';

import { _handleEventTransferOnClientSide } from './handle-event-transfer-on-client-side';
import { _handleEventTransferToBot } from './handle-event-transfer-to-bot';
import { _handleEventTransfer } from './handle-event-transfer';

import { _handleEventUserTyping } from './handle-event-user-typing';

import { _joinRoom } from './join-room';
import { _sendOutgoingMessageAcaDebug } from './send-outgoing-message-aca-debug';
import { _sendOutgoingMessageAcaError } from './send-outgoing-message-aca-error';
import { _sendOutgoingMessage } from './send-outgoing-message';
import { _startChat } from './start-chat';

class ChatServerV1SessionProviderSocketio extends ChatServerV1SessionProvider<ChatServerV1Socketio, ChatChannelV1<IChatChannelV1Configuration>> {

  static async getInstance(server: ChatServerV1Socketio, socket: any) {
    const RET_VAL = new ChatServerV1SessionProviderSocketio(server, socket);
    await RET_VAL.init();
    return RET_VAL;
  }

  constructor(server: ChatServerV1Socketio, socket: any) {
    super(server, socket);
  }

  async init() {
    try {
      await this.assignSession();
      await this.subscribe2EventStreamChatApp();
      this.clearRoom();
      this.assignEventEmitterSTTAndListeners();
      this.assignEventEmitterTTSAndListeners();
      await this.joinRoom();
    } catch (error) {
      const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
      logger.error(this.init.name, { ACA_ERROR });
      this.emitError({ ACA_ERROR });
      return;
    }
  }

  _resetToken() {
    refreshToken(this);
    const JWT_TOKEN_ENCODED = this.session?.token?.value;
    this.socket.handshake.query['x-aca-conversation-token'] = JWT_TOKEN_ENCODED;
  }

  async emit(type, data) {
    if (
      lodash.isEmpty(this.socket)
    ) {
      logger.warn('Missing this.socket - skipping emit method!');
      return;
    }
    this.socket.emit(type, data);
  }

  async emitError(data) {
    this.socket.emit('error', data);
  }

  async disconnectFromChannel() {
    if (
      this.channel
    ) {
      await this.channel.disconnect();
    }
  }

  async disconnect(reason = undefined) {
    await this.disconnectFromChannel();
    await this.deleteSession();
    this.socket.disconnect(reason);
  }

  async deleteSession() {
    try {
      if (
        this.session
      ) {
        await deleteSession(this.session);
        delete this.session;
      }
    } catch (error) {
      const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
      logger.error(this.deleteSession.name, { ACA_ERROR });
      throw ACA_ERROR;
    }
  }

  async assignSession() {
    await _assignSession(this);
  }

  private async assignEventEmitterSTTAndListeners() {
    await _assignEventEmitterSTTAndListeners(this);
  }

  private async assignEventEmitterTTSAndListeners() {
    await _assignEventEmitterTTSAndListeners(this);
  }

  private async joinRoom() {
    await _joinRoom(this);
  }

  private clearRoom() {
    _clearRoom(this);
  }

  async startChat() {
    await _startChat(this);
  }

  async continueChat() {
    await _continueChat(this);
  }

  async handleEventDisconnectFromWidget() {
    await _handleEventDisconnectFromWidget(this);
  }

  async handleEventDisconnectClientSide() {
    await _handleEventDisconnectClientSide(this);
  }

  async handleEventDisconnect() {
    await _handleEventDisconnect(this);
  }

  async handleEventIncomingMessageAudioTranscribed(messageAudioTranscribed: any) {
    await _handleEventIncomingMessageAudioTranscribed(this, messageAudioTranscribed);
  }

  async handleEventIncomingMessageAudio(messageAudio: any) {
    await _handleEventIncomingMessageAudio(this, messageAudio);
  }

  async handleEventIncomingMessage(message: IChatMessageV1) {
    await _handleEventIncomingMessage(this, message);
  }

  async handleEventOutgoingMessageAudio(messageAudio: any) {
    await _handleEventOutgoingMessageAudio(this, messageAudio);
  }

  async handleEventTransferOnClientSide(message: IChatMessageV1) {
    await _handleEventTransferOnClientSide(this, message);
  }

  async handleEventTransferToBot(message: IChatMessageV1) {
    await _handleEventTransferToBot(this, message);
  }

  async handleEventTransfer(message: IChatMessageV1) {
    await _handleEventTransfer(this, message);
  }

  async sendOutgoingMessage(message: IChatMessageV1) {
    await _sendOutgoingMessage(this, message);
  }

  async sendOutgoingMessageAcaDebug(moduleId: string, data: any) {
    await _sendOutgoingMessageAcaDebug(this, moduleId, data);
  }

  async sendOutgoingMessageAcaError(moduleId: string, error: any) {
    await _sendOutgoingMessageAcaError(this, moduleId, error);
  }

  async handleEventUserTyping(status: any) {
    await _handleEventUserTyping(this, status);
  }

  async handleEventClearRoom(event: any) {
    await _handleEventClearRoom(this, event);
  }

}

export {
  ChatServerV1SessionProviderSocketio,
}
