/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-authorization-service-retrieve-audio-voice-services';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { formatIntoAcaError } = require('@ibm-aca/aca-utils-errors');
const { getAcaAudioVoiceServicesDatasourceByTenant } = require('@ibm-aca/aca-audio-voice-services-datasource-provider');

const retrieveAudioVoiceServices = async (tenant, params) => {
  const CHAT_APP_SERVER_CONFIG = params?.session?.engagement?.chatAppServer;
  const CHAT_APP_SERVER_AUDIO_VOICE_SERVICES_CONFIG = CHAT_APP_SERVER_CONFIG?.voiceServices;
  const CHAT_APP_STT_SERVICE_ID = CHAT_APP_SERVER_AUDIO_VOICE_SERVICES_CONFIG?.sttServiceId;
  const CHAT_APP_TTS_SERVICE_ID = CHAT_APP_SERVER_AUDIO_VOICE_SERVICES_CONFIG?.ttsServiceId;

  let retVal;
  try {
    retVal = {};
    const DATASOURCE = getAcaAudioVoiceServicesDatasourceByTenant(tenant);

    if (
      !lodash.isEmpty(DATASOURCE)
    ) {
      const CONTEXT = {
        user: {
          id: 'CHAT_APP_USER'
        }
      }
      if (
        !lodash.isEmpty(CHAT_APP_STT_SERVICE_ID)
      ) {
        const STT_SERVICE = await DATASOURCE.audioVoiceServices.findOneById(CONTEXT, { id: CHAT_APP_STT_SERVICE_ID });
        retVal.sttService = STT_SERVICE;
      }
      if (
        !lodash.isEmpty(CHAT_APP_TTS_SERVICE_ID)
      ) {
        const TTS_SERVICE = await DATASOURCE.audioVoiceServices.findOneById(CONTEXT, { id: CHAT_APP_TTS_SERVICE_ID });
        retVal.ttsService = TTS_SERVICE;
      }
    }

    return retVal;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    ACA_ERROR.data = {
      tenant: {
        id: tenant?.id,
        hash: tenant?.hash,
      }
    }
    logger.error(retrieveAudioVoiceServices.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

module.exports = {
  retrieveAudioVoiceServices,
}
