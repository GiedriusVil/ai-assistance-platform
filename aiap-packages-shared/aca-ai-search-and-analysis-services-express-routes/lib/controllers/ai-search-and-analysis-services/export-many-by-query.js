/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-ai-search-and-analysis-services-express-routes-controllers-ai-search-and-analysis-services-export-many-by-query';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const ramda = require('@ibm-aca/aca-wrapper-ramda');
const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { ACA_ERROR_TYPE, formatIntoAcaError, throwAcaError, appendDataToError } = require('@ibm-aca/aca-utils-errors');
const { currentDateAsString } = require('@ibm-aiap/aiap-utils-date');

const {
  constructActionContextFromRequest,
  constructDefaultFindManyQueryFromRequest,
} = require('@ibm-aiap/aiap-utils-express-routes');

const { aiSearchAndAnalysisServicesService } = require('@ibm-aca/aca-ai-search-and-analysis-services-service');

const _constructFileName = (context) => {
  try {
    const TENANT_ID = context?.user?.session?.tenant?.id;
    const RET_VAL = `[${TENANT_ID}]ai-search-and-analysis-services.${currentDateAsString()}.json`;
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error('_constructFileName', { ACA_ERROR });
    throw ACA_ERROR;
  }
}

const exportManyByQuery = async (request, response) => {
  const CONTEXT = constructActionContextFromRequest(request);
  const USER = CONTEXT?.user;
  const USER_ID = USER?.id;
  const PARAMS = constructDefaultFindManyQueryFromRequest(request);
  const ERRORS = [];
  let result;
  try {
    const RESULT = await aiSearchAndAnalysisServicesService.findManyByQuery(CONTEXT, PARAMS);
    const ITEMS = RESULT?.items;
    if (
      lodash.isEmpty(ITEMS)
    ) {
      const MESSAGE = `Unable to find ai-search-and-analysis-services!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE, MESSAGE);
    }
    result = ITEMS;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, { USER_ID, PARAMS });
    ERRORS.push({ ACA_ERROR });
  }
  if (
    lodash.isEmpty(ERRORS)
  ) {
    const FILE_NAME = _constructFileName(CONTEXT);
    response.setHeader('Content-disposition', `attachment; filename=${FILE_NAME}`);
    response.set('Content-Type', 'application/json');
    response.status(200).json(result);
  } else {
    logger.error(exportManyByQuery.name, { ERRORS });
    response.status(400).json(ERRORS);
  }
};

module.exports = {
  exportManyByQuery,
};
