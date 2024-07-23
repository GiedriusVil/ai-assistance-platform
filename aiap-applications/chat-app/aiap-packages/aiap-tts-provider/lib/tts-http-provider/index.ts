/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-stt-provider-tts-http-provider';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import { AIAPTTSProvider } from '../tts-provider';

import ramda from '@ibm-aca/aca-wrapper-ramda';
import lodash from '@ibm-aca/aca-wrapper-lodash';

import { formatIntoAcaError, throwAcaError, ACA_ERROR_TYPE } from '@ibm-aca/aca-utils-errors';

import {
  ITTSServiceV1,
  IChatMessageV1
} from '@ibm-aiap/aiap-chat-app--types';
class AIAPTTSHttpProvider extends AIAPTTSProvider {
  configuration: any;

  constructor() {
    super();
  }

  static getClassName() {
    return 'AIAPTTSHttpProvider';
  }

  init(
    ttsService: ITTSServiceV1
  ): void {
    const CONFIGURATION = ttsService?.configurations;
    const SERVICE_URL = CONFIGURATION?.serviceUrl;

    if (lodash.isEmpty(SERVICE_URL)) {
      const MESSAGE = `TTS Service URL is missing!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }
    this.configuration = CONFIGURATION;
  }

  async handleIncomingMessage(
    message: IChatMessageV1
  ): Promise<void> {
    try {
      const MESSAGE_TEXT = message?.message?.text;
      const CONVERSATION_ID = message?.traceId?.conversationId;

      if (lodash.isEmpty(MESSAGE_TEXT)) {
        const MESSAGE = `message.message.text is missing! ${message}`;
        throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
      }

      if (lodash.isEmpty(CONVERSATION_ID)) {
        const MESSAGE = `message.traceId.conversationId is missing! ${message}`;
        throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
      }

      const TTS_REQUEST = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: MESSAGE_TEXT
      }

      const TTS_URL = this.configuration?.serviceUrl;

      const TTS_RESPONSE_RAW = await fetch(TTS_URL, TTS_REQUEST);

      const TTS_RESPONSE_ARRAY_BUFFER = await TTS_RESPONSE_RAW.arrayBuffer();

      logger.info(AIAPTTSHttpProvider.getClassName(),
        {
          TTS_RESPONSE_ARRAY_BUFFER
        });

      const MESSAGE_WITH_AUDIO = lodash.cloneDeep(message);
      MESSAGE_WITH_AUDIO.message.audio = TTS_RESPONSE_ARRAY_BUFFER;

      this.emitToRoom(`${CONVERSATION_ID}`, MESSAGE_WITH_AUDIO);

    } catch (error) {
      const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
      logger.error(this.handleIncomingMessage.name, { ACA_ERROR });
      throw ACA_ERROR;
    }
  }
}

export {
  AIAPTTSHttpProvider,
}
