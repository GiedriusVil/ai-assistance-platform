/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-stt-provider-stt-ibm-cloud-provider';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import ramda from '@ibm-aca/aca-wrapper-ramda';
import lodash from '@ibm-aca/aca-wrapper-lodash';

import {
  IamAuthenticator,
  SpeechToTextV1
} from '@ibm-aiap/aiap-wrapper-ibm-watson';

import {
  ACA_ERROR_TYPE,
  formatIntoAcaError,
  throwAcaError,
} from '@ibm-aca/aca-utils-errors';

import {
  ISTTServiceV1,
  IChatMessageV1
} from '@ibm-aiap/aiap-chat-app--types';

import { AIAPSTTProvider } from '../stt-provider';

enum MIME_TYPES_AUDIO {
  AUDIO_WEBM = 'audio/webm',
  AUDIO_WEBM_OPUS = 'audio/webm;codecs=opus'
}

const DEFAULT_STT_MODEL = 'en-US_Telephony';

class AIAPSTTIbmCloudProvider extends AIAPSTTProvider {
  configuration: any;
  sttService: SpeechToTextV1;

  constructor() {
    super();
  }

  static getClassName() {
    return 'AIAPSTTIbmCloudProvider';
  }

  init(
    sttService: ISTTServiceV1
  ): void {
    try {
      const STT_SERVICE_CONFIGURATIONS = sttService?.configurations;
      const API_KEY = STT_SERVICE_CONFIGURATIONS?.apiKey;
      const SERVICE_URL = STT_SERVICE_CONFIGURATIONS?.serviceUrl;
      if (
        lodash.isEmpty(API_KEY)
      ) {
        const ERROR_MESSAGE = `STT Service API key is missing!`;
        throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, ERROR_MESSAGE);
      }

      if (
        lodash.isEmpty(SERVICE_URL)
      ) {
        const ERROR_MESSAGE = `STT Service URL is missing!`;
        throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, ERROR_MESSAGE);
      }
      const SPEECT_TO_TEXT = new SpeechToTextV1({
        authenticator: new IamAuthenticator({
          apikey: `${API_KEY}`,
        }),
        serviceUrl: `${SERVICE_URL}`,
      });
      this.configuration = STT_SERVICE_CONFIGURATIONS;
      this.sttService = SPEECT_TO_TEXT;
    } catch (error) {
      const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
      logger.error(this.init.name, { ACA_ERROR });
      throw ACA_ERROR;
    }
  }


  async handleIncomingAudioMessage(
    audioMessage: IChatMessageV1
  ): Promise<void> {
    try {
      const AUDIO_MESSAGE = audioMessage?.message;
      const AUDIO_BINARY = AUDIO_MESSAGE?.audio;
      const CONVERSATION_ID = audioMessage?.conversationId;

      if (lodash.isEmpty(AUDIO_MESSAGE)) {
        const MESSAGE = `audioMessage.message is missing! ${audioMessage}`;
        throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
      }

      if (lodash.isEmpty(AUDIO_BINARY)) {
        const MESSAGE = `audioMessage.message.audio is missing! ${audioMessage}`;
        throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
      }

      if (lodash.isEmpty(CONVERSATION_ID)) {
        const MESSAGE = `audioMessage.message.conversationId is missing! ${audioMessage}`;
        throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
      }

      const STT_MODEL = this.assignSttModelBasedOnSelectedLanguage(audioMessage);
      const BACKGOUND_AUDIO_SUPPRESSION = this.configuration?.backgroundAudioSuppression ?? '0.5';

      const PARAMS = {
        audio: AUDIO_BINARY,
        contentType: MIME_TYPES_AUDIO.AUDIO_WEBM,
        model: STT_MODEL,
        backgroundAudioSuppression: BACKGOUND_AUDIO_SUPPRESSION
      }

      const STT_RESPONSE_RAW = await this.sttService.recognize(PARAMS);
      const STT_RESPONSE_BODY = STT_RESPONSE_RAW?.result;

      const STT_RESPONSE_RESULTS = STT_RESPONSE_BODY?.results;

      logger.info(AIAPSTTIbmCloudProvider.getClassName(),
        {
          STT_RESPONSE_BODY
        });

      const STT_RESPONSE_TRANSCTRIPT = STT_RESPONSE_RESULTS?.[0]?.alternatives?.[0]?.transcript;
      const STT_RESPONSE_CONFIDENCE = STT_RESPONSE_RESULTS?.[0]?.alternatives?.[0]?.confidence;

      logger.info(AIAPSTTIbmCloudProvider.getClassName(),
        {
          STT_RESPONSE_TRANSCTRIPT,
          STT_RESPONSE_CONFIDENCE
        });

      const TRANSCRIBED_MESSAGE = {
        message: {
          text: STT_RESPONSE_TRANSCTRIPT,
          confidence: STT_RESPONSE_CONFIDENCE,
          timestamp: audioMessage?.message?.timestamp,
          sender_action: audioMessage?.message?.sender_action
        },
        gAcaProps: audioMessage?.gAcaProps,
        clientSideInfo: audioMessage?.clientSideInfo
      }

      this.emitToRoom(`${CONVERSATION_ID}`, TRANSCRIBED_MESSAGE);

    } catch (error) {
      const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
      logger.error(this.handleIncomingAudioMessage.name, { ACA_ERROR });
      throw ACA_ERROR;
    }
  }

  assignSttModelBasedOnSelectedLanguage(
    message: IChatMessageV1
  ): string {
    let retVal = DEFAULT_STT_MODEL;
    const MESSAGE_G_ACA_PROPS = message?.gAcaProps;
    const ISO_LANG = MESSAGE_G_ACA_PROPS?.isoLang;
    const USER_SELECTED_LANGUAGE = MESSAGE_G_ACA_PROPS?.userSelectedLanguage;
    const SELECTED_LANGUAGE_ISO2 = USER_SELECTED_LANGUAGE?.iso2;
    const MODELS_BY_LANGUAGE_ISO2 = this.configuration?.modelsByLanguage;

    if (
      (!lodash.isEmpty(SELECTED_LANGUAGE_ISO2) || !lodash.isEmpty(ISO_LANG)) &&
      !lodash.isEmpty(MODELS_BY_LANGUAGE_ISO2)
    ) {
      const SELECTED_LANGUAGE = SELECTED_LANGUAGE_ISO2 ?? ISO_LANG;
      const MODEL_BY_LANGUAGE = MODELS_BY_LANGUAGE_ISO2?.[SELECTED_LANGUAGE];

      if (!lodash.isEmpty(MODEL_BY_LANGUAGE)) {
        retVal = MODEL_BY_LANGUAGE;
      }
    }
    return retVal;
  }
}

export {
  AIAPSTTIbmCloudProvider,
}
