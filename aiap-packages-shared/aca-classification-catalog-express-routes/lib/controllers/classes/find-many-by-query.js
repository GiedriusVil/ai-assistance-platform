/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-classification-catalog-express-controller-classes-find-many-by-query';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { formatIntoAcaError, appendDataToError } = require('@ibm-aca/aca-utils-errors');

const { constructActionContextFromRequest } = require('@ibm-aiap/aiap-utils-express-routes');

const { classesService } = require('@ibm-aca/aca-classification-catalog-service');

const findManyByQuery = async (request, response) => {
  const ERRORS = [];
  let context;
  let contextUserId;
  let params;
  let retVal;
  try {
    context = constructActionContextFromRequest(request);
    contextUserId = context?.user?.id;
    const REQUEST_BODY = request?.body;
    params = {
      filter: {
        search: REQUEST_BODY?.filter?.search,
        catalogId: REQUEST_BODY?.filter?.catalogId,
        segmentId: REQUEST_BODY?.filter?.segmentId,
        familyId: REQUEST_BODY?.filter?.familyId,
      },
      pagination: REQUEST_BODY?.pagination,
      sort: REQUEST_BODY?.sort,
    }
    let filterOptions = REQUEST_BODY?.filterOptions;
    if (
      lodash.isEmpty(filterOptions)
    ) {
      filterOptions = {
        strict: {
          catalogId: true,
          segmentId: true,
          familyId: true,
        }
      }
    }
    params.filterOptions = filterOptions;
    retVal = await classesService.findManyByQuery(context, params);
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
    logger.error(`${findManyByQuery.name}`, { errors: ERRORS });
    response.status(500).json({ errors: ERRORS });
  }
}

module.exports = {
  findManyByQuery,
}
