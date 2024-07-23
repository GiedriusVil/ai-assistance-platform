/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'validation-engagements-express-routes-validation-engagements-changes-find-many-by-query';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { formatIntoAcaError } = require('@ibm-aca/aca-utils-errors');
const { constructActionContextFromRequest } = require('@ibm-aiap/aiap-utils-express-routes');

const { validationEngagementsChangesService } = require('@ibm-aca/aca-validation-engagements-service');

const findManyByQuery = async (request, response) => {
  const ERRORS = [];
  let retVal;
  try {
    const CONTEXT = constructActionContextFromRequest(request);
    const PARAMS = request?.body;

    retVal = await validationEngagementsChangesService.findManyByQuery(CONTEXT, PARAMS);
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    ERRORS.push(ACA_ERROR);
  }
  if (
    lodash.isEmpty(ERRORS)
  ) {
    response.status(200).json(retVal);
  } else {
    logger.error(`${findManyByQuery.name}`, { errors: ERRORS });
    response.status(500).json(ERRORS);
  }
}

module.exports = {
  findManyByQuery,
}
