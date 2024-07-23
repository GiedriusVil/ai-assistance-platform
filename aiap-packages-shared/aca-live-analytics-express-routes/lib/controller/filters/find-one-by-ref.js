/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-live-analytics-express-routes-filters-find-one-by-ref';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { appendDataToError, formatIntoAcaError, throwAcaError, ACA_ERROR_TYPE } = require('@ibm-aca/aca-utils-errors');
const { constructActionContextFromRequest } = require('@ibm-aiap/aiap-utils-express-routes');

const { liveAnalyticsFiltersService } = require('@ibm-aca/aca-live-analytics-filters-service');

const findOneByRef = async (request, response) => {
  const ERRORS = [];
  let context;
  let params;
  let result;
  try {
    context = constructActionContextFromRequest(request);
    params = request?.body;
    if (
      lodash.isEmpty(params)
    ) {
      const MESSAGE = `Missing required request.body parameter!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }

    if (lodash.isEmpty(ERRORS)) {
      result = await liveAnalyticsFiltersService.findOneByRef(context, params);
    }
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, { context, params });
    ERRORS.push(ACA_ERROR);
  }
  if (lodash.isEmpty(ERRORS)) {
    response.status(200).json(result);
  } else {
    logger.error(findOneByRef.name, { ERRORS });
    response.status(500).json({ errors: ERRORS });
  }
};

module.exports = {
  findOneByRef,
};
