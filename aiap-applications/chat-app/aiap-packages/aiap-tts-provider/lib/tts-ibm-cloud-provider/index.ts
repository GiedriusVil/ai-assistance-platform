/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-tts-provider-tts-ibm-cloud-provider';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import lodash from '@ibm-aca/aca-wrapper-lodash';

import {
  IamAuthenticator,
  TextToSpeechV1
} from '@ibm-aiap/aiap-wrapper-ibm-watson';

import { formatIntoAcaError, throwAcaError, ACA_ERROR_TYPE } from '@ibm-aca/aca-utils-errors';

import {
  ITTSServiceV1,
  IChatMessageV1
} from '@ibm-aiap/aiap-chat-app--types';

import { AIAPTTSProvider } from '../tts-provider';

enum MIME_TYPES_AUDIO {
  AUDIO_WEBM = 'audio/webm',
  AUDIO_WEBM_OPUS = 'audio/webm;codecs=opus'
}

const DEFAULT_TTS_VOICE = 'en-US_HenryV3Voice';

class AIAPTTSIbmCloudProvider extends AIAPTTSProvider {
  configuration: any;
  ttsService: TextToSpeechV1;

  constructor() {
    super();
  }

  static getClassName() {
    return 'AIAPTTSIbmCloudProvider';
  }

  init(
    ttsService: ITTSServiceV1
  ): void {
    const TTS_SERVICE_CONFIGURATIONS = ttsService?.configurations;
    const API_KEY = TTS_SERVICE_CONFIGURATIONS?.apiKey;
    const SERVICE_URL = TTS_SERVICE_CONFIGURATIONS?.serviceUrl;

    if (lodash.isEmpty(API_KEY)) {
      const MESSAGE = `TTS Service API key is missing!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }

    if (lodash.isEmpty(SERVICE_URL)) {
      const MESSAGE = `TTS Service URL is missing!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }

    const TEXT_TO_SPEECH = new TextToSpeechV1({
      authenticator: new IamAuthenticator({
        apikey: `${API_KEY}`,
      }),
      serviceUrl: `${SERVICE_URL}`,
    });
    this.configuration = TTS_SERVICE_CONFIGURATIONS;
    this.ttsService = TEXT_TO_SPEECH;
  }


  async handleIncomingMessage(
    message: IChatMessageV1
  ): Promise<void> {
    try {
      const SELF = this;
      const MESSAGE_TEXT = message?.message?.text;
      const CONVERSATION_ID = message?.traceId?.conversationId;
      const BUFFER_CHUNKS = [];

      if (lodash.isEmpty(MESSAGE_TEXT)) {
        const MESSAGE = `message.message.text is missing! ${message}`;
        throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
      }

      if (lodash.isEmpty(CONVERSATION_ID)) {
        const MESSAGE = `message.traceId.conversationId is missing! ${message}`;
        throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
      }

      const TTS_VOICE = this.assignTtsVoiceBasedOnSelectedLanguage(message);
      const AUDIO_FORMAT = this.configuration?.audioFormat ?? MIME_TYPES_AUDIO.AUDIO_WEBM;

      const TTS_REQUEST_PARAMS = {
        voice: TTS_VOICE,
        accept: AUDIO_FORMAT,
        text: JSON.stringify(MESSAGE_TEXT),
      }

      const TTS_RESPONSE_RAW = await this.ttsService.synthesize(TTS_REQUEST_PARAMS);
      const TTS_INCOMING_STREAM = TTS_RESPONSE_RAW.result;
      TTS_INCOMING_STREAM.on('data', function (chunk) {
        BUFFER_CHUNKS.push(chunk);
      })

      TTS_INCOMING_STREAM.on('end', function () {
        let arrayBuffer = Buffer.concat(BUFFER_CHUNKS);
        const MESSAGE_WITH_AUDIO = lodash.cloneDeep(message);
        MESSAGE_WITH_AUDIO.message.audio = arrayBuffer;

        SELF.emitToRoom(`${CONVERSATION_ID}`, MESSAGE_WITH_AUDIO);
      });
    } catch (error) {
      const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
      logger.error(this.handleIncomingMessage.name, { ACA_ERROR });
      throw ACA_ERROR;
    }
  }

  assignTtsVoiceBasedOnSelectedLanguage(
    message: IChatMessageV1
  ): string {
    let retVal = DEFAULT_TTS_VOICE;
    const MESSAGE_G_ACA_PROPS = message?.session?.gAcaProps;
    const ISO_LANG = MESSAGE_G_ACA_PROPS?.isoLang;
    const USER_SELECTED_LANGUAGE = MESSAGE_G_ACA_PROPS?.userSelectedLanguage;
    const SELECTED_LANGUAGE_ISO2 = USER_SELECTED_LANGUAGE?.iso2;
    const VOICES_BY_LANGUAGE_ISO2 = this.configuration?.voicesByLanguage;
    if (
      (!lodash.isEmpty(SELECTED_LANGUAGE_ISO2) || !lodash.isEmpty(ISO_LANG)) &&
      !lodash.isEmpty(VOICES_BY_LANGUAGE_ISO2)
    ) {
      const SELECTED_LANGUAGE = SELECTED_LANGUAGE_ISO2 ?? ISO_LANG;
      const VOICE_BY_LANGUAGE = VOICES_BY_LANGUAGE_ISO2?.[SELECTED_LANGUAGE];

      if (!lodash.isEmpty(VOICE_BY_LANGUAGE)) {
        retVal = VOICE_BY_LANGUAGE;
      }
    }
    return retVal;
  }
}

export {
  AIAPTTSIbmCloudProvider,
}
