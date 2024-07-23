/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-analytics-live-express-routes-controllers-feedbacks-positive-and-negative-feedbacks';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const ramda = require('@ibm-aca/aca-wrapper-ramda');
const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { formatIntoAcaError, appendDataToError } = require('@ibm-aca/aca-utils-errors');

const {
  constructActionContextFromRequest,
  constructQueryDateRangeFromRequest,
} = require('@ibm-aiap/aiap-utils-express-routes');

const { feedbacksService } = require('@ibm-aca/aca-analytics-live-service');

const positiveAndNegativeFeedbacks = async (request, response) => {
  const ERRORS = [];
  let context;
  let contextUserId;
  let params;
  let result;
  try {
    context = constructActionContextFromRequest(request);
    contextUserId = context?.user?.id;

    const QUERY_DATE = constructQueryDateRangeFromRequest(request);

    const ENCODED_SELECTED_SKILLS = ramda.path(['query', 'encodedSelectedSkills'], request);

    const ASSISTANT_IDS = ramda.path(['query', 'assistantIds'], request);
    const PARSED_ASSISTANT_IDS = ASSISTANT_IDS && JSON.parse(ASSISTANT_IDS);

    params = {
      queryDate: QUERY_DATE,
      assistantIds: PARSED_ASSISTANT_IDS,
    };

    if (!lodash.isEmpty(ENCODED_SELECTED_SKILLS)) {
      params.selectedSkills = JSON.parse(ENCODED_SELECTED_SKILLS);
    }

    if (lodash.isEmpty(ERRORS)) {
      result = await feedbacksService.positiveAndNegativeFeedbacks(context, params);
    }
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, { contextUserId, params });
    ERRORS.push(ACA_ERROR);
  }

  if (lodash.isEmpty(ERRORS)) {
    response.status(200).json(result);
  } else {
    logger.error(`${positiveAndNegativeFeedbacks.name}`, { errors: ERRORS });
    response.status(500).json({ errors: ERRORS });
  }
};

module.exports = {
  positiveAndNegativeFeedbacks,
};
