/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-jobs-queues-express-controller-catalogs-find-many-by-query';
const LOGGER = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const lodash = require('lodash');
const ramda = require('ramda');

const {
  constructActionContextFromRequest,
  constructDefaultFindManyQueryFromRequest
} = require('@ibm-aiap/aiap-utils-express-routes');

const { transformContextForLogger } = require('@ibm-aca/aca-data-transformer');
const { formatIntoAcaError } = require('@ibm-aca/aca-utils-errors');

const { jobsQueuesService } = require('@ibm-aca/aca-jobs-queues-service');

const findManyByQuery = async (request, response) => {
  const ERRORS = [];
  let retVal;
  try {
    const DEFAULT_QUERY = constructDefaultFindManyQueryFromRequest(request);
    const HTTP_QUERY = ramda.path(['query'], request);
    const FILTER_SEARCH = ramda.path(['search'], HTTP_QUERY);

    DEFAULT_QUERY.filter = {
      search: FILTER_SEARCH
    };

    if (lodash.isEmpty(ERRORS)) {
      const PARAMS = {
        ...DEFAULT_QUERY
      };

      const CONTEXT = constructActionContextFromRequest(request);

      LOGGER.info('->', {
        params: PARAMS,
        context: transformContextForLogger(CONTEXT)
      });

      retVal = await jobsQueuesService.findManyByQuery(CONTEXT, PARAMS);
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
  findManyByQuery,
}
