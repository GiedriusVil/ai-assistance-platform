/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-jobs-queues-express-routes-controllers-catalogs-find-one-by-id';
const LOGGER = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const ramda = require('ramda');
const lodash = require('lodash');

const { constructActionContextFromRequest } = require('@ibm-aiap/aiap-utils-express-routes');
const {
  transformContextForLogger,
} = require('@ibm-aca/aca-data-transformer');
const { formatIntoAcaError } = require('@ibm-aca/aca-utils-errors');


const { jobsQueuesService } = require('@ibm-aca/aca-jobs-queues-service');

const findOneById = async (request, response) => {
  const ERRORS = [];
  let result;
  try {
    const ID = ramda.path(['query', 'id'], request);
    if (lodash.isEmpty(ERRORS)) {
      const CONTEXT = constructActionContextFromRequest(request);
      const PARAMS = {
        id: ID
      }
      LOGGER.info('->', {
        params: PARAMS,
        context: transformContextForLogger(CONTEXT),
      });
      result = await jobsQueuesService.findOneById(CONTEXT, PARAMS);
    }
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    ERRORS.push(ACA_ERROR);
  }
  if (lodash.isEmpty(ERRORS)) {
    response.status(200).json(result);
  } else {
    LOGGER.error('ERRORS', { errors: ERRORS });
    response.status(500).json({ errors: ERRORS });
  }
};

module.exports = {
  findOneById
}
