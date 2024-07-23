/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-live-analytics-express-routes-controller-tiles-models-changes-find-many-by-query';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { constructActionContextFromRequest } = require('@ibm-aiap/aiap-utils-express-routes');
const { throwAcaError, ACA_ERROR_TYPE, appendDataToError, formatIntoAcaError } = require('@ibm-aca/aca-utils-errors');
const { liveAnalyticsTilesChangesService } = require('@ibm-aca/aca-live-analytics-tiles-service');

const findManyByQuery = async (request, response) => {
  const CONTEXT = constructActionContextFromRequest(request);
  const USER_ID = CONTEXT?.user?.id;
  const QUERY = request?.body?.query;
  const ERRORS = [];
  let retVal;
  try {
    if (
      lodash.isEmpty(QUERY)
    ) {
      const MESSAGE = `Missing required request.body.query parameter`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }
    const PARAMS = {
      ...QUERY
    };
    retVal = await liveAnalyticsTilesChangesService.findManyByQuery(CONTEXT, PARAMS);
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, { USER_ID, QUERY });
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
  findManyByQuery,
}
