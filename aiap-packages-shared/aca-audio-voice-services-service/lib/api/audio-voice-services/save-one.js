/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-audio-voice-services-service-lib-api-save-one';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { formatIntoAcaError } = require('@ibm-aca/aca-utils-errors');

const { appendAuditInfo } = require('@ibm-aiap/aiap-utils-audit');

const { getDatasourceByContext } = require('../datasource.utils');

const runtimeDataService = require('../runtime-data');


const saveOne = async (context, params) => {
  try {
    const DATASOURCE = getDatasourceByContext(context);
    appendAuditInfo(context, params.audioVoiceService);
    const RET_VAL = await DATASOURCE.audioVoiceServices.saveOne(context, params);

    await runtimeDataService.synchronizeWithConfigDirectoryAudioVoiceService(context, { audioVoiceService: RET_VAL });

    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(`${saveOne.name}`, { ACA_ERROR });
    throw ACA_ERROR;
  }
};

module.exports = {
  saveOne,
}
