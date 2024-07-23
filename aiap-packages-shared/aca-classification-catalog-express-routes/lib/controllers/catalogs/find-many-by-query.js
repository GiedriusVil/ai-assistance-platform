/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-classification-catalog-express-controller-catalogs-find-many-by-query';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { formatIntoAcaError, appendDataToError } = require('@ibm-aca/aca-utils-errors');

const {
  constructActionContextFromRequest,
  constructDefaultFindManyQueryFromRequest
} = require('@ibm-aiap/aiap-utils-express-routes');

const { catalogsService } = require('@ibm-aca/aca-classification-catalog-service');

const findManyByQuery = async (request, response) => {
  const ERRORS = [];
  let context;
  let contextUserId;
  let params;
  let retVal;
  try {
    context = constructActionContextFromRequest(request);
    contextUserId = context?.user?.id;
    const DEFAULT_QUERY = constructDefaultFindManyQueryFromRequest(request);
    const HTTP_QUERY = request?.query;
    const FILTER_SEARCH = HTTP_QUERY?.search;
    DEFAULT_QUERY.filter = {
      search: FILTER_SEARCH
    };
    params = {
      ...DEFAULT_QUERY,
    };
    retVal = await catalogsService.findManyByQuery(context, params);
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, { contextUserId, params });
    ERRORS.push(ACA_ERROR);
  }
  if (
    lodash.isEmpty(ERRORS)
  ) {
    response.status(200).json(retVal);
  } else {
    logger.error('ERRORS', { errors: ERRORS });
    response.status(500).json({ errors: ERRORS });
  }
}

module.exports = {
  findManyByQuery,
}
