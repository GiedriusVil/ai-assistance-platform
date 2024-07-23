/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-classifier-express-routes-controller-classifier-models-test-one-by-id';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const ramda = require('@ibm-aca/aca-wrapper-ramda');
const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { constructActionContextFromRequest } = require('@ibm-aiap/aiap-utils-express-routes');
const { throwAcaError, ACA_ERROR_TYPE, appendDataToError, formatIntoAcaError } = require('@ibm-aca/aca-utils-errors');
const { classifierService } = require('@ibm-aca/aca-classifier-service');

const testOneById = async (request, response) => {
  const CONTEXT = constructActionContextFromRequest(request);
  const USER_ID = ramda.path(['user', 'id'], CONTEXT)
  const ID = ramda.path(['body', 'id'], request);
  const PHRASE = ramda.path(['body', 'phrase'], request);
  const ERRORS = [];
  let retVal;
  try {
    if (
      lodash.isEmpty(ID)
    ) {
      const MESSAGE = `Missing required request.body.id parameter`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }
    const PARAMS = { id: ID, phrase: PHRASE };
    const CONTEXT = constructActionContextFromRequest(request);
    retVal = await classifierService.testOneById(CONTEXT, PARAMS);
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, { USER_ID, ID, PHRASE });
    ERRORS.push(ACA_ERROR);
  }
  if (lodash.isEmpty(ERRORS)) {
    response.status(200).json(retVal);
  } else {
    logger.error('ERRORS', { errors: ERRORS });
    response.status(500).json({ errors: ERRORS });
  }
}

module.exports = {
  testOneById,
}
