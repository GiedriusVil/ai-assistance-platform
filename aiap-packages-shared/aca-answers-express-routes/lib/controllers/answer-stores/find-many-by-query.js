/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-answers-express-routes-answer-stores-find-many-by-query';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const { formatIntoAcaError } = require('@ibm-aca/aca-utils-errors');

const lodash = require('@ibm-aca/aca-wrapper-lodash');

const {
  constructActionContextFromRequest,
  constructDefaultFindManyQueryFromRequest
} = require('@ibm-aiap/aiap-utils-express-routes');

const { answerStoresService } = require('@ibm-aca/aca-answers-service');

const findManyByQuery = async (request, response) => {
  const ERRORS = [];
  let retVal;
  let params;
  try {
    const DEFAULT_QUERY = constructDefaultFindManyQueryFromRequest(request);
    const CONTEXT = constructActionContextFromRequest(request);
    const HTTP_QUERY = request?.query;
    const FILTER_SEARCH = HTTP_QUERY?.search;
    if (!lodash.isEmpty(FILTER_SEARCH)) {
      DEFAULT_QUERY.filter = {
        search: FILTER_SEARCH
      };
    }
    params = {
      ...DEFAULT_QUERY,
    };
    retVal = await answerStoresService.findManyByQuery(CONTEXT, params);
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    ERRORS.push(ACA_ERROR);
  }
  if (
    !lodash.isEmpty(ERRORS)
  ) {
    logger.error('ERRORS', { ERRORS });
    response.status(500).json(ERRORS);
  } else {
    response.status(200).json(retVal);
  }
}

module.exports = {
  findManyByQuery,
}
