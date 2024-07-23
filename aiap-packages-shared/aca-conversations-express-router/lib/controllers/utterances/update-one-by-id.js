/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-conversations-express-router-utterances-find-many-by-query';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const ramda = require('@ibm-aca/aca-wrapper-ramda');
const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { constructActionContextFromRequest } = require('@ibm-aiap/aiap-utils-express-routes');
const { utterancesService } = require('@ibm-aca/aca-conversations-service');

const updateOneById = async (request, response) => {
  const ERRORS = [];

  const UTTERANCE_ID = ramda.path(['params', 'id'], request);
  const STATUS = ramda.path(['body', 'status'], request);
  const FALSE_POSITIVE_VALUE = ramda.path(['body', 'falsePositiveValue'], request);

  const FEEDBACK_ID = ramda.path(['body', 'feedbackId'], request);
  const COMMENT = ramda.path(['body', 'comment'], request);
  const USER_ID = ramda.path(['body', 'username'], request);

  let retVal;
  try {
    const CONTEXT = constructActionContextFromRequest(request);
    const UPDATE_ONE_BY_ID_PARAMS = {
      id: UTTERANCE_ID,
      status: STATUS,
      topIntentFalsePositive: FALSE_POSITIVE_VALUE,
      feedbackId: FEEDBACK_ID,
      comment: COMMENT,
      userId: USER_ID
    }
    logger.info('INFO', { UPDATE_ONE_BY_ID_PARAMS });

    if (lodash.isEmpty(ERRORS)) {
      retVal = await utterancesService.updateOneById(CONTEXT, UPDATE_ONE_BY_ID_PARAMS);
    }
  } catch (error) {
    ERRORS.push({
      type: 'SYSTEM_ERROR',
      text: `${error}`,
      json: error
    });
  }
  if (
    lodash.isEmpty(ERRORS)
  ) {
    response.status(200).json(retVal);
  } else {

    logger.error('ERRORS:', { ERRORS });
    response.status(500).json(ERRORS);
  }
}

module.exports = {
  updateOneById,
}
