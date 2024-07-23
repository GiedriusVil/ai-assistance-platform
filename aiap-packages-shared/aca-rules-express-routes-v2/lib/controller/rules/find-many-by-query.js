/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-rules-express-routes-v2-controller-rules-find-many-by-query';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const ramda = require('@ibm-aca/aca-wrapper-ramda');
const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { throwAcaError, ACA_ERROR_TYPE, formatIntoAcaError } = require('@ibm-aca/aca-utils-errors');
const { constructActionContextFromRequest } = require('@ibm-aiap/aiap-utils-express-routes');

const { rulesService } = require('@ibm-aca/aca-rules-service-v2');

const findManyByQuery = async (request, response) => {
  const ERRORS = [];
  const PARAMS = request?.body;
  let result;
  try {
    const CONTEXT = constructActionContextFromRequest(request);
    if (
      lodash.isEmpty(PARAMS)
    ) {
      const MESSAGE = 'Missing required request.body attribute!';
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }
    result = await rulesService.findManyByQuery(CONTEXT, PARAMS);
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    ACA_ERROR.params = PARAMS;
    ERRORS.push(ACA_ERROR);
  }
  if (lodash.isEmpty(ERRORS)) {
    response.status(200).json(result);
  } else {
    logger.error(findManyByQuery.name, ERRORS);
    response.status(500).json({ errors: ERRORS });
  }
};

module.exports = {
  findManyByQuery,
};
