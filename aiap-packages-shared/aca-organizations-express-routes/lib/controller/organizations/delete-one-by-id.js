/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-server-controllers-organizations-delete-one-by-id';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const ramda = require('@ibm-aca/aca-wrapper-ramda');
const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { formatIntoAcaError, throwAcaError, ACA_ERROR_TYPE, appendDataToError } = require('@ibm-aca/aca-utils-errors');
const { constructActionContextFromRequest } = require('@ibm-aiap/aiap-utils-express-routes');
const { organizationsService } = require('@ibm-aca/aca-organizations-service');

const deleteOneById = async (request, response) => {
  const ERRORS = [];
  const CONTEXT = constructActionContextFromRequest(request);
  const PARAMS = ramda.path(['body'], request);
  let result;
  try {
    if (
      lodash.isEmpty(PARAMS)
    ) {
      const MESSAGE = `Missing required request.body parameter!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }
    result = await organizationsService.deleteOneById(CONTEXT, PARAMS);
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, { PARAMS });
    ERRORS.push(ACA_ERROR);
  }

  if (lodash.isEmpty(ERRORS)) {
    response.status(200).json(result);
  } else {
    logger.error('->', { ERRORS });
    response.status(500).json({ errors: ERRORS });
  }
};


module.exports = {
  deleteOneById,
};
