/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-ai-search-and-analysis-services-express-routes-controllers-ai-search-and-analysis-collections-import-many-from-file';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const ramda = require('@ibm-aca/aca-wrapper-ramda');
const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { formatIntoAcaError, throwAcaError, ACA_ERROR_TYPE, appendDataToError } = require('@ibm-aca/aca-utils-errors');
const { constructActionContextFromRequest } = require('@ibm-aiap/aiap-utils-express-routes');

const { aiSearchAndAnalysisCollectionsService } = require('@ibm-aca/aca-ai-search-and-analysis-services-service');

const importManyFromFile = async (request, response) => {
  const CONTEXT = constructActionContextFromRequest(request);
  const USER_ID = CONTEXT?.user?.id;

  const FILE = request?.file;
  const AI_SEARCH_AND_ANALYSIS_SERVICE_ID = request?.body?.aiSearchAndAnalysisServiceId;
  const AI_SEARCH_AND_ANALYSIS_PROJECT_ID = request?.body?.aiSearchAndAnalysisProjectId;

  const ERRORS = [];
  let result;
  try {
    if (
      lodash.isEmpty(AI_SEARCH_AND_ANALYSIS_SERVICE_ID)
    ) {
      const MESSAGE = 'Missing required request.body.aiSearchAndAnalysisServiceId paramater!';
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }
    if (
      lodash.isEmpty(AI_SEARCH_AND_ANALYSIS_PROJECT_ID)
    ) {
      const MESSAGE = 'Missing required request.body.aiSearchAndAnalysisProjectId paramater!';
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }
    if (
      lodash.isEmpty(FILE)
    ) {
      const MESSAGE = 'Missing required request.file paramater!';
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }
    const PARAMS = {
      file: FILE,
      aiSearchAndAnalysisServiceId: AI_SEARCH_AND_ANALYSIS_SERVICE_ID,
      aiSearchAndAnalysisProjectId: AI_SEARCH_AND_ANALYSIS_PROJECT_ID,
    };
    result = await aiSearchAndAnalysisCollectionsService.importMany(CONTEXT, PARAMS);
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, { USER_ID, FILE });
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
  importManyFromFile,
};
