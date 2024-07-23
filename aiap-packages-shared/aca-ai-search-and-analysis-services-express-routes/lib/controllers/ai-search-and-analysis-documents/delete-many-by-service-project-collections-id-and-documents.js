/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-ai-search-and-analysis-services-express-routes-controllers-ai-search-and-analysis-documents-delete-many-by-service-project-collection-id-and-documents';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const ramda = require('@ibm-aca/aca-wrapper-ramda');
const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { formatIntoAcaError, appendDataToError, throwAcaError, ACA_ERROR_TYPE } = require('@ibm-aca/aca-utils-errors');
const { constructActionContextFromRequest } = require('@ibm-aiap/aiap-utils-express-routes');
const { aiSearchAndAnalysisDocumentsService } = require('@ibm-aca/aca-ai-search-and-analysis-services-service');

const deleteManyByServiceProjectCollectionsAndDocuments = async (request, response) => {
  const CONTEXT = constructActionContextFromRequest(request);
  const USER_ID = CONTEXT?.user?.id;
  const AI_SEARCH_AND_ANALYSIS_SERVICE_ID = request?.body?.aiSearchAndAnalysisServiceId;
  const AI_SEARCH_AND_ANALYSIS_PROJECT_ID = request?.body?.aiSearchAndAnalysisProjectId;
  const AI_SEARCH_AND_ANALYSIS_DOCUMENTS = request?.body?.aiSearchAndAnalysisDocuments;
  const AI_SEARCH_AND_ANALYSIS_COLLECTION_ID = request?.body?.aiSearchAndAnalysisCollectionId;
  const ERRORS = [];
  let result;
  try {
    if (
      lodash.isEmpty(AI_SEARCH_AND_ANALYSIS_COLLECTION_ID)
    ) {
      const MESSAGE = `Missing required request.body.aiSearchAndAnalysisProjectId paramater!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }
    if (
      lodash.isEmpty(AI_SEARCH_AND_ANALYSIS_SERVICE_ID)
    ) {
      const MESSAGE = `Missing required request.body.aiSearchAndAnalysisServiceId paramater!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }
    if (
      lodash.isEmpty(AI_SEARCH_AND_ANALYSIS_PROJECT_ID)
    ) {
      const MESSAGE = `Missing required request.body.aiSearchAndAnalysisProjectId paramater!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }
    const PARAMS = {
      aiSearchAndAnalysisDocuments: AI_SEARCH_AND_ANALYSIS_DOCUMENTS,
      aiSearchAndAnalysisServiceId: AI_SEARCH_AND_ANALYSIS_SERVICE_ID,
      aiSearchAndAnalysisProjectId: AI_SEARCH_AND_ANALYSIS_PROJECT_ID,
      aiSearchAndAnalysisCollectionId: AI_SEARCH_AND_ANALYSIS_COLLECTION_ID,
    };
    result = await aiSearchAndAnalysisDocumentsService.deleteManyByServiceProjectCollectionsAndDocuments(CONTEXT, PARAMS);
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, {
      USER_ID,
      AI_SEARCH_AND_ANALYSIS_SERVICE_ID,
      AI_SEARCH_AND_ANALYSIS_PROJECT_ID,
      AI_SEARCH_AND_ANALYSIS_COLLECTION_ID,
      AI_SEARCH_AND_ANALYSIS_DOCUMENTS,
    });
    ERRORS.push(ACA_ERROR);
  }
  if (
    lodash.isEmpty(ERRORS)
  ) {
    response.status(200).json(result);
  } else {
    logger.error('ERRORS', { errors: ERRORS });
    response.status(500).json({ errors: ERRORS });
  }
};

module.exports = {
  deleteManyByServiceProjectCollectionsAndDocuments,
};
