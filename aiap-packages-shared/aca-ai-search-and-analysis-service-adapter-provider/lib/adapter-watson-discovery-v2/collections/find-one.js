/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-ai-search-and-analysis-service-adapter-provider-adapter-watson-discovery-v2-collections-create-one';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { getWatsonDiscoveryServiceByAiSearchAndAnalysisService } = require('@ibm-aca/aca-watson-discovery-provider');

const { formatIntoAcaError, throwAcaError, ACA_ERROR_TYPE } = require('@ibm-aca/aca-utils-errors');

const findOne = async (context, params) => {
  const AI_SEARCH_AND_ANALYSIS_SERVICE = params?.aiSearchAndAnalysisService;
  const AI_SEARCH_AND_ANALYSIS_PROJECT = params?.aiSearchAndAnalysisProject;
  const AI_SEARCH_AND_ANALYSIS_COLLECTION = params?.aiSearchAndAnalysisCollection;

  try {
    if (lodash.isEmpty(AI_SEARCH_AND_ANALYSIS_SERVICE)) {
      const MESSAGE = 'Missing required params.aiSearchAndAnalysisService parameter';
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }
    if (!lodash.isArray(AI_SEARCH_AND_ANALYSIS_PROJECT)) {
      const MESSAGE = 'Missing required params.aiSearchAndAnalysisProject parameter';
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, MESSAGE);
    }
    if (!lodash.isArray(AI_SEARCH_AND_ANALYSIS_COLLECTION)) {
      const MESSAGE = 'Missing required params.aiSearchAndAnalysisCollection parameter';
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, MESSAGE);
    }

    const WATSON_DISCOVERY_SERVICE = getWatsonDiscoveryServiceByAiSearchAndAnalysisService(AI_SEARCH_AND_ANALYSIS_SERVICE);

    const PARAMS = {
      projectId: AI_SEARCH_AND_ANALYSIS_PROJECT?.external?.project_id,
      collectionId: AI_SEARCH_AND_ANALYSIS_COLLECTION?.external?.collection_id,
    }

    const RESPONSE = await WATSON_DISCOVERY_SERVICE.collections.findOne(context, PARAMS);

    const RET_VAL = {
      name: RESPONSE.result.name,
      description: RESPONSE.result.description,
      language: RESPONSE.result.language,
      external: RESPONSE.result,
    };

    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(findOne.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
};

module.exports = {
  findOne,
};
