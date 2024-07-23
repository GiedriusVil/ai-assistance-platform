/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-chat-server-provider-socketio-server-session-provider-handle-event-incoming-message-audio';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import lodash from '@ibm-aca/aca-wrapper-lodash';

import {
  throwAcaError,
  ACA_ERROR_TYPE,
  formatIntoAcaError,
} from '@ibm-aca/aca-utils-errors';

import {
  ChatServerV1SessionProviderSocketio,
} from '.';

const STT_NOT_CONFIGURED_MESSAGE = 'No STT Services are configured!';

const _handleEventIncomingMessageAudio = async (
  chatServerSessionProvider: ChatServerV1SessionProviderSocketio,
  messageAudio: any,
) => {
  let isAudioMuted;
  try {
    if (
      !chatServerSessionProvider
    ) {
      const ERROR_MESSAGE = `Missing required chatServerSessionProvider parameter!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, ERROR_MESSAGE);
    }
    const CONVERSATION_ID = chatServerSessionProvider.session?.conversation?.id;
    isAudioMuted = messageAudio?.message?.audioMuted;
    if (
      lodash.isEmpty(messageAudio)
    ) {
      const MESSAGE = `Missing required messageAudio parameter!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }
    if(
      lodash.isBoolean(isAudioMuted) 
    ) {
      chatServerSessionProvider.session.isAudioMuted = isAudioMuted;
    }
    if (
      !lodash.isEmpty(chatServerSessionProvider.eventEmitterSTT)
    ) {
      messageAudio.conversationId = CONVERSATION_ID;
      chatServerSessionProvider.eventEmitterSTT.emit('audioMessage', messageAudio);
    } else {
      delete messageAudio.message.audio;
      messageAudio.message.text = STT_NOT_CONFIGURED_MESSAGE;
      chatServerSessionProvider.socket.send(messageAudio);
    }
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(_handleEventIncomingMessageAudio.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

export {
  _handleEventIncomingMessageAudio,
}
