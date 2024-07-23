/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-ai-search-and-analysis-services-service-ai-search-and-analysis-projects-save-one';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const { formatIntoAcaError, appendDataToError, throwAcaError, ACA_ERROR_TYPE } = require('@ibm-aca/aca-utils-errors');
const { getDatasourceByContext } = require('../datasource.utils');

const { getRegistry } = require('@ibm-aca/aca-ai-search-and-analysis-service-adapter-provider');
const lodash = require('@ibm-aca/aca-wrapper-lodash');

const saveOne = async (context, params) => {
  const USER_ID = context?.user?.id;
  const AI_SEARCH_AND_ANALYSIS_PROJECT = params?.aiSearchAndAnalysisProject;
  const AI_SEARCH_AND_ANALYSIS_SERVICE_ID = params?.aiSearchAndAnalysisServiceId;
  const AI_SEARCH_AND_ANALYSIS_PROJECT_TYPE = AI_SEARCH_AND_ANALYSIS_PROJECT?.type;
  const AI_SEARCH_AND_ANALYSIS_PROJECT_NAME = AI_SEARCH_AND_ANALYSIS_PROJECT?.name;
  const IS_IMPORT = params?.isImport;
  try {
    if (lodash.isEmpty(AI_SEARCH_AND_ANALYSIS_SERVICE_ID)) {
      const MESSAGE = `Missing params.aiSearchAndAnalysisServiceId`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }
    if (lodash.isEmpty(AI_SEARCH_AND_ANALYSIS_PROJECT_TYPE)) {
      const MESSAGE = `Missing params.aiSearchAndAnalysisProject.type`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }
    if (lodash.isEmpty(AI_SEARCH_AND_ANALYSIS_PROJECT_NAME)) {
      const MESSAGE = `Missing params.aiSearchAndAnalysisProject.name`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }

    const DATASOURCE = getDatasourceByContext(context);

    const AI_SEARCH_AND_ANALYSIS_SERVICE = await DATASOURCE.aiSearchAndAnalysisServices.findOneById(context, { id: AI_SEARCH_AND_ANALYSIS_SERVICE_ID });

    if (lodash.isEmpty(AI_SEARCH_AND_ANALYSIS_SERVICE)) {
      const MESSAGE = `Unable to find AI_SEARCH_AND_ANALYSIS_SERVICE with id: ${AI_SEARCH_AND_ANALYSIS_SERVICE_ID}!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, MESSAGE);
    }

    const AI_SEARCH_AND_ANALYSIS_SERVICE_ADAPTER = getRegistry()[AI_SEARCH_AND_ANALYSIS_SERVICE?.type];

    if (!lodash.isObject(AI_SEARCH_AND_ANALYSIS_SERVICE_ADAPTER)) {
      const MESSAGE = `Unsupported AI_SEARCH_AND_ANALYSIS_SERVICE_ADAPTER type! Given: ${AI_SEARCH_AND_ANALYSIS_SERVICE?.type}`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, MESSAGE);
    }

    const CREATE_ONE_PARAMS = {
      aiSearchAndAnalysisService: AI_SEARCH_AND_ANALYSIS_SERVICE,
      aiSearchAndAnalysisProject: AI_SEARCH_AND_ANALYSIS_PROJECT,
      isImport: IS_IMPORT,
    };

    const RESPONSE = await AI_SEARCH_AND_ANALYSIS_SERVICE_ADAPTER.projects.createOne(context, CREATE_ONE_PARAMS);

    AI_SEARCH_AND_ANALYSIS_PROJECT.external = RESPONSE;
    AI_SEARCH_AND_ANALYSIS_PROJECT.serviceId = AI_SEARCH_AND_ANALYSIS_SERVICE_ID;

    const RET_VAL = await DATASOURCE.aiSearchAndAnalysisProjects.saveOne(context, params);
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, { USER_ID });
    logger.error('->', { ACA_ERROR });
    throw ACA_ERROR;
  }
};

module.exports = {
  saveOne,
};
