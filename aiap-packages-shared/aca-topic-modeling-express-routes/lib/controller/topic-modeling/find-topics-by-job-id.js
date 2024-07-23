/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-topic-modeling-express-routes-controller-find-topics-by-job-id';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const ramda = require('@ibm-aca/aca-wrapper-ramda');
const lodash = require('@ibm-aca/aca-wrapper-lodash');
const { formatIntoAcaError, appendDataToError, ACA_ERROR_TYPE, throwAcaError } = require('@ibm-aca/aca-utils-errors');

const { constructActionContextFromRequest } = require('@ibm-aiap/aiap-utils-express-routes');

const { topicModelingService } = require('@ibm-aca/aca-topic-modeling-service');

const findTopicsByJobId = async (request, response) => {
  const ERRORS = [];
  const CONTEXT = constructActionContextFromRequest(request);
  const CONTEXT_USER_ID = CONTEXT?.user?.id;
  const BODY = request?.body;
  const JOB_ID = BODY?.jobId;
  let result;
  try {
    if (
      lodash.isEmpty(JOB_ID)
    ) {
      const MESSAGE = `Missing required request.body.jobId parameter!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }
    result = await topicModelingService.findTopicsByJobId(CONTEXT, BODY);
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, { CONTEXT_USER_ID });
    ERRORS.push(ACA_ERROR);
  }
  if (lodash.isEmpty(ERRORS)) {
    response.status(200).json(result);
  } else {
    logger.error(findTopicsByJobId.name, { ERRORS });
    response.status(500).json({ errors: ERRORS });
  }
};

module.exports = {
  findTopicsByJobId,
};
