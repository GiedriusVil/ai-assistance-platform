/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-coach-express-routes-controller-stop-watch-metrics-save-one'
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { throwAcaError, ACA_ERROR_TYPE, formatIntoAcaError } = require('@ibm-aca/aca-utils-errors');

const { constructActionContextFromRequest } = require('@ibm-aiap/aiap-utils-express-routes');

const { stopWatchMetricsService } = require('@ibm-aca/aca-coach-service');

const saveOne = async (request, response) => {
  const ERRORS = [];
  let context;
  let stopWatchMetric;
  let params;
  let result;
  try {
    context = constructActionContextFromRequest(request);
    stopWatchMetric = request?.body;
    if (
      lodash.isEmpty(stopWatchMetric)
    ) {
      const MESSAGE = `Missing erquired request.body parameter!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }

    params = { stopWatchMetric: stopWatchMetric };
    result = await stopWatchMetricsService.saveOne(context, params);
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
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
