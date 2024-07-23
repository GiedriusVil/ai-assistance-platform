/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-classification-catalog-express-controller-retrieve-canonical-form-by-input';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { throwAcaError, ACA_ERROR_TYPE, formatIntoAcaError, appendDataToError } = require('@ibm-aca/aca-utils-errors');

const { constructActionContextFromRequest } = require('@ibm-aiap/aiap-utils-express-routes');

const { segmentsService } = require('@ibm-aca/aca-classification-catalog-service');

const retrieveCanonicalFormByInput = async (request, response) => {
  const ERRORS = [];
  let context;
  let contextUserId;
  let params;
  let retVal;
  try {
    context = constructActionContextFromRequest(request);
    contextUserId = context?.user?.id;
    const INPUT = request?.body?.input;
    const SOURCE = request?.body?.source;
    if (
      lodash.isEmpty(INPUT)
    ) {
      const MESSAGE = `Missing required request.body.input parameter!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }
    if (
      lodash.isEmpty(SOURCE)
    ) {
      const MESSAGE = `Missing required request.body.source parameter!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }
    params = {
      input: INPUT,
      source: SOURCE,
    };
    retVal = await segmentsService.retrieveCanonicalFormByInput(context, params);
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, { contextUserId, params });
    ERRORS.push(ACA_ERROR);
  }
  if (
    lodash.isEmpty(ERRORS)
  ) {
    response.status(200).json(retVal);
  } else {
    logger.error(`${retrieveCanonicalFormByInput.name}`, { errors: ERRORS });
    response.status(500).json({ errors: ERRORS });
  }
}

module.exports = {
  retrieveCanonicalFormByInput,
}
