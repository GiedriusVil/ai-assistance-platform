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

import { getSTTRegistry } from '@ibm-aiap/aiap-stt-provider';

import {
  ChatServerV1SessionProviderSocketio
} from '.';

const _assignEventEmitterSTTAndListeners = async (
  chatServerSessionProvider: ChatServerV1SessionProviderSocketio,
) => {
  try {
    if (
      !chatServerSessionProvider
    ) {
      const ERROR_MESSAGE = `Missing required chatServerSessionProvider parameter!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, ERROR_MESSAGE);
    }
    const STT_SERVICE = chatServerSessionProvider.session?.engagement?.audioVoiceServices?.sttService;
    const STT_SERVICE_TYPE = STT_SERVICE?.type;
    if (
      lodash.isEmpty(STT_SERVICE_TYPE)
    ) {
      const WARN_MESSAGE = 'Missing STT service configurations!'
      logger.warn(WARN_MESSAGE);
      return;
    }
    const STT_PROVIDR_REGISTRY = getSTTRegistry();
    const STT_EVENT_EMITTER = STT_PROVIDR_REGISTRY[STT_SERVICE_TYPE]; //Type should be taken from incoming configuration in session engagements
    const CONVERSATION_ID = chatServerSessionProvider.session?.conversation?.id;

    if (
      !lodash.isEmpty(STT_EVENT_EMITTER) &&
      !lodash.isEmpty(CONVERSATION_ID)
    ) {
      //init from  stt configuration
      STT_EVENT_EMITTER.init(STT_SERVICE);
      STT_EVENT_EMITTER.joinRoom(`${CONVERSATION_ID}`, chatServerSessionProvider.handleEventIncomingMessageAudioTranscribed.bind(chatServerSessionProvider));
      chatServerSessionProvider.eventEmitterSTT = STT_EVENT_EMITTER;
    }
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(_assignEventEmitterSTTAndListeners.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}


export {
  _assignEventEmitterSTTAndListeners,
}
