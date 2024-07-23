/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-rules-express-routes-controller-rules-import-submit';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const ramda = require('@ibm-aca/aca-wrapper-ramda');
const lodash = require('@ibm-aca/aca-wrapper-lodash');
const { appendDataToError, formatIntoAcaError } = require('@ibm-aca/aca-utils-errors');

const { constructActionContextFromRequest } = require('@ibm-aiap/aiap-utils-express-routes');

const { rulesImportService } = require('@ibm-aca/aca-rules-service');


const submitImport = async (request, response) => {
  const ERRORS = [];
  const CONTEXT = constructActionContextFromRequest(request);
  const CONTEXT_USER_ID = ramda.path(['user', 'id'], CONTEXT);
  let result;
  try {
    result = await rulesImportService.submitImport(CONTEXT);
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, { CONTEXT_USER_ID })
    ERRORS.push(ACA_ERROR);
  }
  if (
    lodash.isEmpty(ERRORS)
  ) {
    response.status(200).json(result);
  } else {
    logger.error('->', { ERRORS });
    response.status(500).json({ errors: ERRORS });
  }
};

module.exports = {
  submitImport,
};
