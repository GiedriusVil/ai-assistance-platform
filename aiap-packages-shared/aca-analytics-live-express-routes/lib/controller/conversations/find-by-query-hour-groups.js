/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-analytics-live-express-routes-controllers-conversations-find-hour-groups-by-query';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { formatIntoAcaError, appendDataToError } = require('@ibm-aca/aca-utils-errors');

const {
  constructActionContextFromRequest,
} = require('@ibm-aiap/aiap-utils-express-routes');

const { conversationsService } = require('@ibm-aca/aca-analytics-live-service');

const findByQueryHourGroups = async (request, response) => {
  const ERRORS = [];
  let context;
  let contextUserId;
  let requestBody;
  let params;
  let result;
  try {
    context = constructActionContextFromRequest(request);
    contextUserId = context?.user?.id;
    requestBody = request?.body;
    params = {
      query: requestBody?.query,
    };
    result = await conversationsService.findByQueryHourGroups(context, params);
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, { contextUserId, params });
    ERRORS.push(ACA_ERROR);
  }

  if (
    lodash.isEmpty(ERRORS)
  ) {
    response.status(200).json(result);
  } else {
    logger.error(`${findByQueryHourGroups.name}`, { errors: ERRORS });
    response.status(500).json({ errors: ERRORS });
  }
};

module.exports = {
  findByQueryHourGroups,
};
