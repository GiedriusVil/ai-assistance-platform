/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-engagements-service-runtime-data-service-delete-many-from-ids-from-config-directory-audio-voice-service';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { formatIntoAcaError, appendDataToError, throwAcaError, ACA_ERROR_TYPE } = require('@ibm-aca/aca-utils-errors');

const path = require('path');
const { fsExtra } = require('@ibm-aca/aca-wrapper-fs-extra');

const { getLibConfiguration } = require('../../configuration');

const deleteManyByIdsFromDirectoryAudioVoiceService = async (context, params) => {
  const AIAP_DIR_CONFIG = process?.env?.AIAP_DIR_CONFIG;
  let configurationLocalSyncEnabled = false;
  let configAbsolutePath;
  try {
    configurationLocalSyncEnabled = getLibConfiguration().configurationLocalSyncEnabled;
    if (
      !lodash.isEmpty(AIAP_DIR_CONFIG) &&
      configurationLocalSyncEnabled
    ) {
      configAbsolutePath = path.resolve(__dirname, `../../../../../${AIAP_DIR_CONFIG}`);
      if (
        !fsExtra.existsSync(configAbsolutePath)
      ) {
        const ERROR_MESSAGE = `Missing configuration repository!`;
        throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, ERROR_MESSAGE);
      }
      if (
        lodash.isEmpty(context?.user?.session?.tenant?.id)
      ) {
        const ERROR_MESSAGE = `Missing required parameter context?.user?.session?.tenant?.id!`;
        throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, ERROR_MESSAGE)
      }
      const DIR_AUDIO_VOICE_SERVICES= `${configAbsolutePath}/runtime-data-local/tenant-customizer/${context?.user?.session?.tenant?.id}/audio-voice-services`;
      fsExtra.ensureDirSync(DIR_AUDIO_VOICE_SERVICES);

      if (
        !lodash.isEmpty(params?.ids) &&
        lodash.isArray(params?.ids)
      ) {
        for (let tmpId of params.ids) {
          if (
            !lodash.isEmpty(tmpId)
          ) {
            fsExtra.removeSync(`${DIR_AUDIO_VOICE_SERVICES}/${tmpId}.json`);
          }
        }
      }
    }
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, {
      configurationLocalSyncEnabled,
      AIAP_DIR_CONFIG,
      configAbsolutePath,
    });
    logger.error(deleteManyByIdsFromDirectoryAudioVoiceService.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

module.exports = {
  deleteManyByIdsFromDirectoryAudioVoiceService,
}
