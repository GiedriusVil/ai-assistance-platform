/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-chat-server-provider-socketio-server-session-provider-send-outgoing-message';
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
  IChatMessageV1,
} from '@ibm-aiap/aiap-chat-app--types';

import {
  ChatServerV1SessionProviderSocketio,
} from '.';

const TTS_NOT_CONFIGURED_MESSAGE = 'No TTS Services are configured!';

const _sendOutgoingMessage = async (
  chatServerSessionProvider: ChatServerV1SessionProviderSocketio,
  message: IChatMessageV1,
) => {
  try {
    if (
      !chatServerSessionProvider
    ) {
      const ERROR_MESSAGE = `Missing required chatServerSessionProvider parameter!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, ERROR_MESSAGE);
    }
    await addMessageToTranscript(chatServerSessionProvider.session, message);
    const SENDER_ACTION_SUB_TYPE = message?.sender_action?.subType || 'N/A';

    const IS_AUDIO_MUTED = chatServerSessionProvider?.session?.isAudioMuted;
    const MESSAGE_TYPE = message?.type;
    switch (SENDER_ACTION_SUB_TYPE) {
      case 'session_closed': {
        await chatServerSessionProvider.disconnect();
        break;
      }
      default: {
        message.session = chatServerSessionProvider.session;
        if (
          lodash.isBoolean(IS_AUDIO_MUTED) &&
          !IS_AUDIO_MUTED &&
          MESSAGE_TYPE !== "notification"
        ) {
          if (
            lodash.isEmpty(chatServerSessionProvider.eventEmitterTTS)
          ) {
            message.message.text = TTS_NOT_CONFIGURED_MESSAGE;
            chatServerSessionProvider.socket.send(message);
            break;
          }
          chatServerSessionProvider.eventEmitterTTS.emit('message', message);
        } else {
          chatServerSessionProvider.socket.send(message);
        }
        break;
      }
    }
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(chatServerSessionProvider.sendOutgoingMessage.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

export {
  _sendOutgoingMessage,
}
