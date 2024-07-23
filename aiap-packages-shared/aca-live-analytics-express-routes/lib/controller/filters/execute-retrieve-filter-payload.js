/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-live-analytics-express-routes-filters-execute-retrieve-filter-payload';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { appendDataToError, formatIntoAcaError, throwAcaError, ACA_ERROR_TYPE } = require('@ibm-aca/aca-utils-errors');
const { constructActionContextFromRequest } = require('@ibm-aiap/aiap-utils-express-routes');

const { liveAnalyticsFiltersService } = require('@ibm-aca/aca-live-analytics-filters-service');

const executeRetrieveFilterPayload = async (request, response) => {
  const ERRORS = [];
  let context;
  let params;
  let retVal;
  try {
    context = constructActionContextFromRequest(request);
    params = request?.body;
    if (lodash.isEmpty(params)) {
      const MESSAGE = `Missing required value request.body`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, MESSAGE);
    }
    if (lodash.isEmpty(ERRORS)) {
      retVal = await liveAnalyticsFiltersService.executeRetrieveFilterPayload(context, params);
    }
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, { context, params });
    ERRORS.push(ACA_ERROR);
  }
  if (
    !lodash.isEmpty(ERRORS)
  ) {
    logger.error(executeRetrieveFilterPayload.name, { ERRORS });
    response.status(500).json(ERRORS);
  } else {
    response.status(200).json(retVal);
  }
}

module.exports = {
  executeRetrieveFilterPayload,
}
