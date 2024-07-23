/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-live-analytics-express-routes-controller-dashboards-models-changes-find-one-by-id';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { constructActionContextFromRequest } = require('@ibm-aiap/aiap-utils-express-routes');
const { throwAcaError, ACA_ERROR_TYPE, appendDataToError, formatIntoAcaError } = require('@ibm-aca/aca-utils-errors');
const { liveAnalyticsDashboardsChangesService } = require('@ibm-aca/aca-live-analytics-dashboards-service');

const findOneById = async (request, response) => {
  const CONTEXT = constructActionContextFromRequest(request);
  const USER_ID = CONTEXT?.user?.id;
  const ID = request?.body?.id;
  const ERRORS = [];
  let result;
  try {
    if (
      lodash.isEmpty(ID)
    ) {
      const MESSAGE = `Missing required request.body.id parameter`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }
    const PARAMS = { id: ID };
    result = await liveAnalyticsDashboardsChangesService.findOneById(CONTEXT, PARAMS);
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, { USER_ID, ID });
    ERRORS.push(ACA_ERROR);
  }
  if (lodash.isEmpty(ERRORS)) {
    response.status(200).json(result);
  } else {
    logger.error('ERRORS', { errors: ERRORS });
    response.status(500).json({ errors: ERRORS });
  }
};

module.exports = {
  findOneById
}
