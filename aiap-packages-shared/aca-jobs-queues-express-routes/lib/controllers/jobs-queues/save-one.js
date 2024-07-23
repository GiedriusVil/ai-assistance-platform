/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-jobs-queues-express-controller-jobs-queues-save-one';
const LOGGER = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const ramda = require('ramda');
const lodash = require('lodash');

const {
  constructActionContextFromRequest,
} = require('@ibm-aiap/aiap-utils-express-routes');

const {
  transformContextForLogger,
} = require('@ibm-aca/aca-data-transformer');
const { formatIntoAcaError } = require('@ibm-aca/aca-utils-errors');


const { jobsQueuesService } = require('@ibm-aca/aca-jobs-queues-service');

const saveOne = async (request, response) => {
  const ERRORS = [];
  let retVal;
  try {
    const INSTANCE = ramda.path(['body'], request);
    if (lodash.isEmpty(ERRORS)) {
      const PARAMS = {
        jobsQueues: INSTANCE
      };

      const CONTEXT = constructActionContextFromRequest(request);

      LOGGER.info('->', {
        context: transformContextForLogger(CONTEXT)
      });

      retVal = await jobsQueuesService.saveOne(CONTEXT, PARAMS);
    }
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    ERRORS.push(ACA_ERROR);
  }
  if (lodash.isEmpty(ERRORS)) {
    response.status(200).json(retVal);
  } else {
    LOGGER.error('ERRORS', { errors: ERRORS });
    response.status(500).json({ errors: ERRORS });
  }
}

module.exports = {
  saveOne,
}
