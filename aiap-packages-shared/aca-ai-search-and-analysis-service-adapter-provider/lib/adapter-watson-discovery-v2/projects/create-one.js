/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-ai-search-and-analysis-service-adapter-provider-adapter-watson-discovery-v2-projects-create-one';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const lodash = require('@ibm-aca/aca-wrapper-lodash');
const ramda = require('@ibm-aca/aca-wrapper-ramda');

const { getWatsonDiscoveryServiceByAiSearchAndAnalysisService } = require('@ibm-aca/aca-watson-discovery-provider');

const { formatIntoAcaError, throwAcaError, ACA_ERROR_TYPE } = require('@ibm-aca/aca-utils-errors');

const { getWatsonDiscoveryProjectType } = require('../../utils');

const createOne = async (context, params) => {
  const AI_SEARCH_AND_ANALYSIS_SERVICE = params?.aiSearchAndAnalysisService;
  const AI_SEARCH_AND_ANALYSIS_PROJECT = params?.aiSearchAndAnalysisProject;
  const IS_IMPORT = params?.isImport;
  try {
    if (
      lodash.isEmpty(AI_SEARCH_AND_ANALYSIS_SERVICE)
    ) {
      const MESSAGE = 'Missing required params.aiSearchAndAnalysisService parameter';
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }
    if (
      lodash.isEmpty(AI_SEARCH_AND_ANALYSIS_PROJECT)
    ) {
      const MESSAGE = 'Missing required params.aiSearchAndAnalysisProject parameter';
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, MESSAGE);
    }

    const NAME = AI_SEARCH_AND_ANALYSIS_PROJECT?.name;
    const TYPE = AI_SEARCH_AND_ANALYSIS_PROJECT?.type;

    if (
      lodash.isEmpty(NAME)
    ) {
      const MESSAGE = 'Missing required aiSearchAndAnalysisProject.name parameter';
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }

    if (lodash.isEmpty(TYPE)) {
      const MESSAGE = 'Missing required aiSearchAndAnalysisProject.type parameter';
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }

    const WATSON_DISCOVERY_SERVICE = getWatsonDiscoveryServiceByAiSearchAndAnalysisService(AI_SEARCH_AND_ANALYSIS_SERVICE);

    let response;
    /*
    * In case of import there might be situation when id and external.project_id
    * will exist, but external.project_id might be from different service.
    * updateOne function might throw 404 error, which could be confusing
    */
    if (
      lodash.isEmpty(AI_SEARCH_AND_ANALYSIS_PROJECT.id) || IS_IMPORT
    ) {
      const PARAMS = {
        name: NAME,
        type: getWatsonDiscoveryProjectType(AI_SEARCH_AND_ANALYSIS_PROJECT),
      }

      response = await WATSON_DISCOVERY_SERVICE.projects.createOne(context, PARAMS);
    } else {
      const PARAMS = {
        name: NAME,
        projectId: AI_SEARCH_AND_ANALYSIS_PROJECT.external.project_id,
      }

      response = await WATSON_DISCOVERY_SERVICE.projects.updateOne(context, PARAMS);
    }

    const RET_VAL = response?.result;

    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(createOne.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
};

module.exports = {
  createOne,
};
