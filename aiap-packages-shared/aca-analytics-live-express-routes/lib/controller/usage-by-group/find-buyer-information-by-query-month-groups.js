/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-analytics-live-express-routes-controllers-entities-find-buyer-information-by-query-month-groups';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { formatIntoAcaError, appendDataToError } = require('@ibm-aca/aca-utils-errors');

const {
  constructActionContextFromRequest,
} = require('@ibm-aiap/aiap-utils-express-routes');

const { usageByGroupService } = require('@ibm-aca/aca-analytics-live-service');

const findBuyerInformationByQueryMonthGroups = async (request, response) => {
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
    result = await usageByGroupService.findBuyerInformationByQueryMonthGroups(context, params);
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
    logger.error(findBuyerInformationByQueryMonthGroups.name, { errors: ERRORS });
    response.status(500).json({ errors: ERRORS });
  }
};

module.exports = {
  findBuyerInformationByQueryMonthGroups,
};
