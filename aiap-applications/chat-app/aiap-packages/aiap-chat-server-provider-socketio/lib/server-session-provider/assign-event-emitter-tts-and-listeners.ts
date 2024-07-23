/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-chat-server-provider-socketio-server-session-provider-assign-event-emitter-stt-and-listeners';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import lodash from '@ibm-aca/aca-wrapper-lodash';

import {
  throwAcaError,
  ACA_ERROR_TYPE,
  formatIntoAcaError,
} from '@ibm-aca/aca-utils-errors';

import { getTTSRegistry } from '@ibm-aiap/aiap-tts-provider';

import {
  ChatServerV1SessionProviderSocketio
} from '.';

const _assignEventEmitterTTSAndListeners = async (
  chatServerSessionProvider: ChatServerV1SessionProviderSocketio,
) => {
  try {
    if (
      !chatServerSessionProvider
    ) {
      const ERROR_MESSAGE = `Missing required chatServerSessionProvider parameter!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, ERROR_MESSAGE);
    }
    const TTS_SERVICE = chatServerSessionProvider.session?.engagement?.audioVoiceServices?.ttsService;
    const TTS_SERVICE_TYPE = TTS_SERVICE?.type;

    if (
      lodash.isEmpty(TTS_SERVICE_TYPE)
    ) {
      logger.warn('Zero TTS services are configured!');
      return;
    }
    const TTS_PROVIDR_REGISTRY = getTTSRegistry();
    const TTS_EVENT_EMITTER = TTS_PROVIDR_REGISTRY[TTS_SERVICE_TYPE]; //Type should be taken from incoming configuration in session engagements
    const CONVERSATION_ID = chatServerSessionProvider.session?.conversation?.id;
    if (
      !lodash.isEmpty(TTS_EVENT_EMITTER) &&
      !lodash.isEmpty(CONVERSATION_ID)
    ) {
      //init from  stt configuration
      TTS_EVENT_EMITTER.init(TTS_SERVICE);
      TTS_EVENT_EMITTER.joinRoom(`${CONVERSATION_ID}`, chatServerSessionProvider.handleEventOutgoingMessageAudio.bind(chatServerSessionProvider));
      chatServerSessionProvider.eventEmitterTTS = TTS_EVENT_EMITTER;
    }

  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(_assignEventEmitterTTSAndListeners.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

export {
  _assignEventEmitterTTSAndListeners,
}
