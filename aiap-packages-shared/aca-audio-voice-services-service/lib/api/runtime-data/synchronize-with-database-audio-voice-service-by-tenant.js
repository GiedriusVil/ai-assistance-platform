/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-audio-voice-services-runtime-data-service-synchronize-with-database-audio-voice-services-by-tenant';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { formatIntoAcaError, throwAcaError, ACA_ERROR_TYPE } = require('@ibm-aca/aca-utils-errors');

const { fsExtra } = require('@ibm-aca/aca-wrapper-fs-extra');

const { getDatasourceByContext } = require('../datasource.utils');

const synchronizeWithDatabaseAudioVoiceServicesByTenant = async (context, params) => {
  let configTenantCustomizerAudioVoiceServicesAbsolutePath;
  let retVal = [];
  try {
    if (
      lodash.isEmpty(params?.configTenantCustomizerAbsolutePath)
    ) {
      const ERROR_MESSAGE = `Missing required parameter params?.configTenantCustomizerAbsolutePath!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, ERROR_MESSAGE)
    }
    if (
      lodash.isEmpty(params?.tenantId)
    ) {
      const ERROR_MESSAGE = `Missing required parameter params?.tenantId!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, ERROR_MESSAGE)
    }
    configTenantCustomizerAudioVoiceServicesAbsolutePath = `${params?.configTenantCustomizerAbsolutePath}/${params?.tenantId}/audio-voice-services`;
    fsExtra.ensureDirSync(configTenantCustomizerAudioVoiceServicesAbsolutePath);

    const AUDIO_VOICE_SERVICES_FILES = fsExtra.readdirSync(configTenantCustomizerAudioVoiceServicesAbsolutePath);

    const PROMISES = [];
    if (
      !lodash.isEmpty(AUDIO_VOICE_SERVICES_FILES) &&
      lodash.isArray(AUDIO_VOICE_SERVICES_FILES)
    ) {
      for (let audioVoiceServiceFile of AUDIO_VOICE_SERVICES_FILES) {
        if (
          !lodash.isEmpty(audioVoiceServiceFile) &&
          lodash.isString(audioVoiceServiceFile) &&
          audioVoiceServiceFile.endsWith('.json')
        ) {
          const AUDIO_VOICE_SERVICE = fsExtra.readJsonSync(`${configTenantCustomizerAudioVoiceServicesAbsolutePath}/${audioVoiceServiceFile}`)
          const DATASOURCE = getDatasourceByContext(context);
          PROMISES.push(
            DATASOURCE.audioVoiceServices.saveOne(context, { audioVoiceService: AUDIO_VOICE_SERVICE })
          );
        }
      }
    }
    retVal = await Promise.all(PROMISES);
    return retVal;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(synchronizeWithDatabaseAudioVoiceServicesByTenant.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

module.exports = {
  synchronizeWithDatabaseAudioVoiceServicesByTenant,
}
