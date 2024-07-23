/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-ai-search-and-analysis-service-adapter-provider-adapter-watson-discovery-v2-projects-find-many';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const lodash = require('@ibm-aca/aca-wrapper-lodash');
const ramda = require('@ibm-aca/aca-wrapper-ramda');

const { formatIntoAcaError, throwAcaError, ACA_ERROR_TYPE } = require('@ibm-aca/aca-utils-errors');

const { getWatsonDiscoveryServiceByAiSearchAndAnalysisService } = require('@ibm-aca/aca-watson-discovery-provider');

const { getProjectType } = require('../../utils');

const findMany = async (context, params) => {
  const AI_SEARCH_AND_ANALYSIS_SERVICE = params?.aiSearchAndAnalysisService;
  const AI_SEARCH_AND_ANALYSIS_PROJECTS = params?.aiSearchAndAnalysisProjects;

  try {
    if (lodash.isEmpty(AI_SEARCH_AND_ANALYSIS_SERVICE)) {
      const MESSAGE = 'Missing required params.aiSearchAndAnalysisService parameter';
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }
    if (!lodash.isArray(AI_SEARCH_AND_ANALYSIS_PROJECTS)) {
      const MESSAGE = 'Wrong type of params.aiSearchAndAnalysisProjects! [Expected: Array]';
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, MESSAGE);
    }

    const AI_SEARCH_AND_ANALYSIS_PROJECTS_EXTERNAL_IDS = new Set();

    AI_SEARCH_AND_ANALYSIS_PROJECTS?.forEach((project) => {
      const EXTERNAL_ID = project?.external?.project_id;
      if (EXTERNAL_ID) {
        AI_SEARCH_AND_ANALYSIS_PROJECTS_EXTERNAL_IDS.add(EXTERNAL_ID);
      }
    });

    const WATSON_DISCOVERY_SERVICE = getWatsonDiscoveryServiceByAiSearchAndAnalysisService(AI_SEARCH_AND_ANALYSIS_SERVICE);

    const PARAMS = { };

    const RESPONSE = await WATSON_DISCOVERY_SERVICE.projects.findMany(context, PARAMS);

    const RET_VAL = [];

    RESPONSE?.result?.projects?.forEach((project) => {
      if (!AI_SEARCH_AND_ANALYSIS_PROJECTS_EXTERNAL_IDS.has(project?.project_id)) {
        const AI_SEARCH_AND_ANALYSIS_PROJECT = {};
        AI_SEARCH_AND_ANALYSIS_PROJECT.name = project.name;
        AI_SEARCH_AND_ANALYSIS_PROJECT.type = getProjectType(project);
        AI_SEARCH_AND_ANALYSIS_PROJECT.external = project;

        RET_VAL.push(AI_SEARCH_AND_ANALYSIS_PROJECT);
      }
    });

    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(findMany.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
};

module.exports = {
  findMany,
};
