/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-analytics-live-express-routes-controllers-dashboards-configurations-delete-many-by-ids';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const ramda = require('@ibm-aca/aca-wrapper-ramda');
const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { formatIntoAcaError, throwAcaError, ACA_ERROR_TYPE, appendDataToError } = require('@ibm-aca/aca-utils-errors');

const { constructActionContextFromRequest } = require('@ibm-aiap/aiap-utils-express-routes');
const { dashboardsConfigurationsService } = require('@ibm-aca/aca-analytics-live-service');

const deleteManyByIds = async (request, response) => {
  let result;
  const ERRORS = [];
  const CONTEXT = constructActionContextFromRequest(request);
  const CONTEXT_USER_ID = CONTEXT?.user?.id;
  const IDS = request?.body?.ids;
  const REASON = request?.body?.reason;
  const PARAMS = { ids: IDS, reason: REASON };
  if (
    lodash.isEmpty(IDS)
  ) {
    const MESSAGE = `Missing required request.body parameter!`;
    throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
  }
  try {
    result = await dashboardsConfigurationsService.deleteManyByIds(CONTEXT, PARAMS);
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, { CONTEXT_USER_ID, PARAMS });
    ERRORS.push(ACA_ERROR);
  }

  if (lodash.isEmpty(ERRORS)) {
    response.status(200).json(result);
  } else {
    logger.error(`${deleteManyByIds.name}`, { errors: ERRORS });
    response.status(500).json({ errors: ERRORS });
  }
};

module.exports = {
  deleteManyByIds,
}
