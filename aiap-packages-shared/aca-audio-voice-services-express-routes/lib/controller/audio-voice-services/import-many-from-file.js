/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-audio-voice-services-express-routes-controllers-audio-voice-services-import-many-from-file';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const ramda = require('ramda');
const lodash = require('lodash');

const { formatIntoAcaError, throwAcaError, ACA_ERROR_TYPE } = require('@ibm-aca/aca-utils-errors');

const { constructActionContextFromRequest } = require('@ibm-aiap/aiap-utils-express-routes');
const { audioVoiceServicesService } = require('@ibm-aca/aca-audio-voice-services-service');

const importManyFromFile = async (request, response) => {
  const ERRORS = [];
  let result;
  try {
    const FILE = request?.file;
    if (
      lodash.isEmpty(FILE)
    ) {
      const MESSAGE = 'Missing audio voice services file!';
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }
    const CONTEXT = constructActionContextFromRequest(request);
    const PARAMS = {
      file: FILE,
    };
    result = await audioVoiceServicesService.importMany(CONTEXT, PARAMS);
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    ERRORS.push(ACA_ERROR);
  }
  if (lodash.isEmpty(ERRORS)) {
    response.status(200).json(result);
  } else {
    logger.error('ERRORS', { errors: ERRORS });
    response.status(500).json({ errors: ERRORS });
  }

};

module.exports = {
  importManyFromFile,
};
