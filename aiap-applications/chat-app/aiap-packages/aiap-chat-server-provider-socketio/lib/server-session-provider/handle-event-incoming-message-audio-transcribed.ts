/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-chat-server-provider-socketio-server-session-provider-handle-event-incoming-message-audio-transcribed';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import lodash from '@ibm-aca/aca-wrapper-lodash';

import {
  throwAcaError,
  ACA_ERROR_TYPE,
  formatIntoAcaError,
} from '@ibm-aca/aca-utils-errors';

import {
  addMessageToTranscript,
} from '@ibm-aca/aca-utils-transcript';

import {
  resetMessageGAcaPropsUserBySession,
  resetMessageGAcaPropsUserProfileBySession,
} from '../../chat-message-utils';

import {
  ChatServerV1SessionProviderSocketio,
} from '.';


const _handleEventIncomingMessageAudioTranscribed = async (
  chatServerSessionProvider: ChatServerV1SessionProviderSocketio,
  messageAudioTranscribed: any,
) => {

  try {
    if (
      !chatServerSessionProvider
    ) {
      const ERROR_MESSAGE = `Missing required chatServerSessionProvider parameter!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, ERROR_MESSAGE);
    }
    const MESSAGE_TRANSCRIPT_TEXT = messageAudioTranscribed?.message?.text;
    const FALLBACK_TEXT = 'Sorry did not heard You. Please repeat'; // Should be Configurable from configuration
    if (
      lodash.isEmpty(MESSAGE_TRANSCRIPT_TEXT)
    ) {
      messageAudioTranscribed.message.text = FALLBACK_TEXT;
      messageAudioTranscribed.message.confidence = 0;
      messageAudioTranscribed.type = 'bot';
      chatServerSessionProvider.socket.emit('transcribedAudioMessage', messageAudioTranscribed);
    } else {
      resetMessageGAcaPropsUserBySession(
        messageAudioTranscribed,
        chatServerSessionProvider?.session,
      );
      resetMessageGAcaPropsUserProfileBySession(
        messageAudioTranscribed,
        chatServerSessionProvider?.session,
      );
      messageAudioTranscribed.engagement = chatServerSessionProvider?.session?.engagement;
      messageAudioTranscribed.type = 'user';
      chatServerSessionProvider.socket.emit('transcribedAudioMessage', messageAudioTranscribed);
      await chatServerSessionProvider.channel.sendMessage(messageAudioTranscribed);
    }

    await addMessageToTranscript(chatServerSessionProvider.session, messageAudioTranscribed);
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(_handleEventIncomingMessageAudioTranscribed.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

export {
  _handleEventIncomingMessageAudioTranscribed,
}
