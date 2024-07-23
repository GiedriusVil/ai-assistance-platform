/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-conversations-express-router-feedbacks-find-one-by-id';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);
const ramda = require('ramda');
const lodash = require('lodash');

const { constructActionContextFromRequest } = require('@ibm-aiap/aiap-utils-express-routes');
const { feedbacksService } = require('@ibm-aca/aca-conversations-service');

const findOneById = async (request, response) => {
  const ERRORS = [];

  const ID = ramda.path(['params', 'id'], request);

  let retVal;
  try {
    if (lodash.isEmpty(ERRORS)) {
      const CONTEXT = constructActionContextFromRequest(request);
      const FIND_ONE_BY_ID = {
        id: ID
      };
      logger.info('FIND_ONE_BY_ID', { FIND_ONE_BY_ID });
      retVal = await feedbacksService.findOneById(CONTEXT, FIND_ONE_BY_ID);
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
  findOneById,
}
