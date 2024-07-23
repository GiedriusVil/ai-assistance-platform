/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-ai-search-and-analysis-services-express-routes-controllers-ai-search-and-analysis-documents-list-many-by-query';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const ramda = require('@ibm-aca/aca-wrapper-ramda');
const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { formatIntoAcaError, appendDataToError, throwAcaError, ACA_ERROR_TYPE } = require('@ibm-aca/aca-utils-errors');
const { constructActionContextFromRequest } = require('@ibm-aiap/aiap-utils-express-routes');
const { aiSearchAndAnalysisDocumentsService } = require('@ibm-aca/aca-ai-search-and-analysis-services-service');

const listManyByQuery = async (request, response) => {
  const CONTEXT = constructActionContextFromRequest(request);
  const USER_ID = CONTEXT?.user?.id;
  const QUERY = request?.body?.query;
  const ERRORS = [];
  let result;
  try {
    if (
      lodash.isEmpty(QUERY)
    ) {
      const MESSAGE = `Missing required request.body.query paramater!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }
    const AI_SEARCH_AND_ANALYSIS_SERVICE_ID = QUERY?.filter?.aiSearchAndAnalysisServiceId;
    const AI_SEARCH_AND_ANALYSIS_PROJECT_ID = QUERY?.filter?.aiSearchAndAnalysisProjectId;
    const AI_SEARCH_AND_ANALYSIS_COLLECTION_ID = QUERY?.filter?.aiSearchAndAnalysisCollectionId;

    if (
      lodash.isEmpty(AI_SEARCH_AND_ANALYSIS_SERVICE_ID)
    ) {
      const MESSAGE = `Missing required request.body.query.filter.aiSearchAndAnalysisServiceId paramater!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }
    if (
      lodash.isEmpty(AI_SEARCH_AND_ANALYSIS_PROJECT_ID)
    ) {
      const MESSAGE = `Missing required request.body.query.filter.aiSearchAndAnalysisProjectId paramater!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }
    if (
      lodash.isEmpty(AI_SEARCH_AND_ANALYSIS_COLLECTION_ID)
    ) {
      const MESSAGE = `Missing required request.body.query.filter.aiSearchAndAnalysisCollectionId paramater!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }
    const PARAMS = {
      ...QUERY
    };

    result = await aiSearchAndAnalysisDocumentsService.listManyByQuery(CONTEXT, PARAMS);
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, { USER_ID, QUERY });
    ERRORS.push(ACA_ERROR);
  }
  if (ramda.isEmpty(ERRORS)) {
    response.status(200).json(result);
  } else {
    logger.error('ERRORS', { errors: ERRORS });
    response.status(500).json({ errors: ERRORS });
  }
};

module.exports = {
  listManyByQuery,
};
