/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-conversations-express-router-feedbacks-save-one';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);
const ramda = require('ramda');
const lodash = require('lodash');

const { constructActionContextFromRequest } = require('@ibm-aiap/aiap-utils-express-routes');
const { feedbacksService } = require('@ibm-aca/aca-conversations-service');

const saveOne = async (request, response) => {
  const ERRORS = [];
  const FEEDBACK = ramda.path(['body'], request);

  let retVal;
  try {
    if (lodash.isEmpty(ERRORS)) {
      const CONTEXT = constructActionContextFromRequest(request);
      const SAVE_ONE_PARAMS = {
        feedback: FEEDBACK
      };
      logger.info('SAVE_ONE_PARAMS', { SAVE_ONE_PARAMS });
      retVal = await feedbacksService.saveOne(CONTEXT, SAVE_ONE_PARAMS);
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
    logger.error('ERRORS', { ERRORS });
    response.status(500).json(ERRORS);
  }
}

module.exports = {
  saveOne,
}
