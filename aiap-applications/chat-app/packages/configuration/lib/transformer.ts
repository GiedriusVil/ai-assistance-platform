/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const {
  isEnabled,
  getKeys,
} = require('@ibm-aiap/aiap-env-configuration-service');

const configurationProvider = require('@ibm-aiap/aiap-env-configuration-service');

const { Configurator } = require('@ibm-aiap/aiap-memory-store-provider/dist/lib/configuration');

import {
  AcaHostPageInfoConfigurator
} from './host-page-info';

import {
  loadExternalLibsConfiguration
} from './external-configurations';

const transformRawConfiguration = async (rawConfiguration) => {

  const RET_VAL: any = {
    channel: {
      genesys: isEnabled('GENESYS_ENABLED', false, {
        channelId: rawConfiguration.GENESYS_CHANNEL_ID,
        uri: rawConfiguration.GENESYS_URL,
        organizationId: rawConfiguration.GENESYS_ORGANIZATION_ID,
        deploymentId: rawConfiguration.GENESYS_DEPLOYMENT_ID,
        queue: rawConfiguration.GENESYS_QUEUE,
      }),
    },
    app: {
      port: rawConfiguration.PORT || 3000,
      conversationIdSecret: rawConfiguration.CONVERSATION_ID_SECRET || 'secret',
      sessionDeleteTimeout: rawConfiguration.SESSION_DELETE_TIMEOUT || 300000,
      continuousChatEnabled: isEnabled('CONTINUOUS_CHAT_ENABLED', false),
    },
    widget: {
      chatAppHost: rawConfiguration.WIDGET_CHAT_APP_HOST,
      title: rawConfiguration.WIDGET_TITLE || 'Virtual Assistant',
      expand: isEnabled('WIDGET_EXPAND_ENABLED', false),
      audio: isEnabled('WIDGET_AUDIO_ENABLED', false),
      inputHistory: isEnabled('INPUT_HISTORY_ENABLED', false),
      prechat: isEnabled('WIDGET_PRECHAT_ENABLED', false),
      draggable: isEnabled('WIDGET_DRAGGABLE_ENABLED', false),
      resizer: isEnabled('WIDGET_RESIZER_ENABLED', false),
    },
    jwt: {
      required: isEnabled('JWT_REQUIRED', false),
      pem: rawConfiguration.JWT_PEM,
    },
    downloadTranscript: isEnabled('DOWNLOAD_TRANSCRIPT_ENABLED', false),
    surveyEnabled: isEnabled('SURVEY_ENABLED', true),
    testUrlEnabled: isEnabled('TEST_URL_ENABLED', false),
    errorDetailsEnabled: isEnabled('ERROR_DETAILS_ENABLED', false),
    voiceServices: isEnabled('VOICE_SERVICES_ENABLED', false, {
      stt: {
        uri: rawConfiguration.VOICE_SERVICES_STT_URI,
        iamApiKey: rawConfiguration.VOICE_SERVICES_STT_API_KEY,
        wss: rawConfiguration.VOICE_SERVICES_STT_WSS,
      },
      tts: {
        uri: rawConfiguration.VOICE_SERVICES_TTS_URI,
        iamApiKey: rawConfiguration.VOICE_SERVICES_TTS_API_KEY,
      },
    }),
    logger: {
      debug: rawConfiguration.DEBUG,
      maskingEnabled: isEnabled('LOG_MASKING_ENABLED', true),
      enablePrettifier: rawConfiguration.LOGGER_ENABLE_PRETTIFIER || false
    },
  };

  RET_VAL.memoryStoreProvider = Configurator.transformRawConfiguration(rawConfiguration, configurationProvider);

  await loadExternalLibsConfiguration(RET_VAL, rawConfiguration, configurationProvider);

  await AcaHostPageInfoConfigurator.loadConfiguration(RET_VAL, rawConfiguration, configurationProvider);

  return RET_VAL;
}

export {
  transformRawConfiguration,
}
