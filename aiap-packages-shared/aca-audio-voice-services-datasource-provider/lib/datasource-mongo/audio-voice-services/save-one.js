/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-audio-voice-services-datasource-mongo-audio-voice-services-save-one';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const lodash = require('@ibm-aca/aca-wrapper-lodash');

const validator = require('validator');

const { formatIntoAcaError, throwAcaError, ACA_ERROR_TYPE, appendDataToError } = require('@ibm-aca/aca-utils-errors');

const { findOneById } = require('./find-one-by-id');

const saveOne = async (datasource, context, params) => {
  const CONTEXT_USER_ID = context?.user?.id;
  const COLLECTION = datasource._collections.audioVoiceServices;

  const PARAMS_AUDIO_VOICE_SERVICE = params?.audioVoiceService;
  const PARAMS_AUDIO_VOICE_SERVICE_ID = params?.audioVoiceService?.refId;

  let filter = {};
  let updateCondition;
  let updateOptions;
  try {
    if (
      lodash.isEmpty(PARAMS_AUDIO_VOICE_SERVICE)
    ) {
      const MESSAGE = `Missing required params.audioVoiceService attribute!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }

    if (
      lodash.isEmpty(PARAMS_AUDIO_VOICE_SERVICE_ID)
    ) {
      const MESSAGE = `Missing required params.audioVoiceService.refId attribute!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }

    if (
      validator.isUUID(PARAMS_AUDIO_VOICE_SERVICE_ID) ||
      validator.isAlphanumeric(PARAMS_AUDIO_VOICE_SERVICE_ID, 'en-US', { ignore: '_-' })
    ) {
      filter = { _id: { $eq: PARAMS_AUDIO_VOICE_SERVICE_ID } };
    } else {
      const ERROR_MESSAGE = `PARAMS_AUDIO_VOICE_SERVICE_ID is invalid!`
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, ERROR_MESSAGE);
    }

    updateCondition = { $set: PARAMS_AUDIO_VOICE_SERVICE };
    updateOptions = { upsert: true };

    const ACA_MONGO_CLIENT = await datasource._getAcaMongoClient();
    await ACA_MONGO_CLIENT
      .__updateOne(context,
        {
          collection: COLLECTION,
          filter: filter,
          update: updateCondition,
          options: updateOptions,
        });

    const RET_VAL = await findOneById(datasource, context, { id: PARAMS_AUDIO_VOICE_SERVICE_ID });
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, { CONTEXT_USER_ID, params, filter, updateCondition });
    logger.error(saveOne.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

module.exports = {
  saveOne,
}
