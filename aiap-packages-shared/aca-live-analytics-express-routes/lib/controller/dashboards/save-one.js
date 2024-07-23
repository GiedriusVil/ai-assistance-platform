/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-live-analytics-express-routes-dashboards-save-one'
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { appendDataToError, formatIntoAcaError, throwAcaError, ACA_ERROR_TYPE } = require('@ibm-aca/aca-utils-errors');

const { constructActionContextFromRequest } = require('@ibm-aiap/aiap-utils-express-routes');

const { liveAnalyticsDashboardsService } = require('@ibm-aca/aca-live-analytics-dashboards-service');

const saveOne = async (request, response) => {
  const ERRORS = [];
  let context;
  let value;
  let params;
  let result;
  try {
    context = constructActionContextFromRequest(request);
    value = request?.body;
    params = { value };
    if (
      lodash.isEmpty(value)
    ) {
      const MESSAGE = `Missing required request.body parameter!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }
    result = await liveAnalyticsDashboardsService.saveOne(context, params);
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, { context, params });
    ERRORS.push(ACA_ERROR);
  }
  if (
    lodash.isEmpty(ERRORS)
  ) {
    response.status(200).json(result);
  } else {
    logger.error(`${saveOne.name}`, { ERRORS });
    response.status(500).json({ errors: ERRORS });
  }
};

module.exports = {
  saveOne,
};
