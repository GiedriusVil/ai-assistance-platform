/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-answer-stores-express-routes-controllers-answer-stores-import-many-from-file';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const ramda = require('@ibm-aca/aca-wrapper-ramda');
const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { formatIntoAcaError, throwAcaError, ACA_ERROR_TYPE } = require('@ibm-aca/aca-utils-errors');

const { constructActionContextFromRequest } = require('@ibm-aiap/aiap-utils-express-routes');
const { answerStoresService } = require('@ibm-aca/aca-answers-service');

const importManyFromFile = async (request, response) => {
  const ERRORS = [];
  let result;
  try {
    const FILE = ramda.path(['file'], request);
    if (
      lodash.isEmpty(FILE)
    ) {
      const MESSAGE = 'Missing answers store file!';
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }
    const CONTEXT = constructActionContextFromRequest(request);
    const PARAMS = {
      file: FILE,
    };
    result = await answerStoresService.importMany(CONTEXT, PARAMS);
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    ERRORS.push(ACA_ERROR);
  }
  if (
    !lodash.isEmpty(ERRORS)
  ) {
    logger.error('ERRORS', { errors: ERRORS });
    response.status(500).json({ errors: ERRORS });
  } else {
    response.status(200).json(result);
  }

};

module.exports = {
  importManyFromFile,
};
