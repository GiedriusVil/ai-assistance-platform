/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-analytics-live-express-routes-controllers-conversations-find-with-user-interaction';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { formatIntoAcaError, appendDataToError } = require('@ibm-aca/aca-utils-errors');

const {
  constructActionContextFromRequest,
} = require('@ibm-aiap/aiap-utils-express-routes');

const { conversationsService } = require('@ibm-aca/aca-analytics-live-service');

const findWithUserInteractionDayGroups = async (request, response) => {
  const ERRORS = [];
  let context;
  let contextUserId;
  let query;
  let params;
  let result;
  let interaction;
  try {
    context = constructActionContextFromRequest(request);
    contextUserId = context?.user?.id;
    query = request?.body?.query;
    interaction = request?.body?.interaction;
    params = { query, interaction }
    result = await conversationsService.findWithUserInteractionDayGroups(context, params);
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
    logger.error(`${findWithUserInteractionDayGroups.name}`, { errors: ERRORS });
    response.status(500).json({ errors: ERRORS });
  }
};

module.exports = {
  findWithUserInteractionDayGroups,
};
