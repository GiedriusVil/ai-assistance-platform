/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-ai-search-and-analysis-service-adapter-provider-adapter-watson-discovery-v2-collections-query-many';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const lodash = require('@ibm-aca/aca-wrapper-lodash');
const ramda = require('@ibm-aca/aca-wrapper-ramda');

const { formatIntoAcaError, throwAcaError, ACA_ERROR_TYPE } = require('@ibm-aca/aca-utils-errors');

const { getWatsonDiscoveryServiceByAiSearchAndAnalysisService } = require('@ibm-aca/aca-watson-discovery-provider');

const queryMany = async (context, params) => {
  const AI_SEARCH_AND_ANALYSIS_SERVICE = params?.aiSearchAndAnalysisService;
  const AI_SEARCH_AND_ANALYSIS_PROJECT = params?.aiSearchAndAnalysisProject;
  const AI_SEARCH_AND_ANALYSIS_COLLECTIONS = params?.aiSearchAndAnalysisCollections;
  const QUERY = params?.query;
  
  try {
    if (lodash.isEmpty(AI_SEARCH_AND_ANALYSIS_SERVICE)) {
      const MESSAGE = 'Missing required params.aiSearchAndAnalysisService parameter';
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }
    if (lodash.isEmpty(AI_SEARCH_AND_ANALYSIS_PROJECT)) {
      const MESSAGE = 'Missing required params.aiSearchAndAnalysisProject parameter';
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, MESSAGE);
    }
    if (!lodash.isArray(AI_SEARCH_AND_ANALYSIS_COLLECTIONS)) {
      const MESSAGE = 'Wrong type of params.aiSearchAndAnalysisCollections! [Expected: Array]';
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, MESSAGE);
    }
    if (lodash.isEmpty(QUERY)) {
      const MESSAGE = 'Missing required params.query parameter';
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, MESSAGE);
    }

    const AI_SEARCH_AND_ANALYSIS_COLLECTIONS_EXTERNAL_IDS = [];

    AI_SEARCH_AND_ANALYSIS_COLLECTIONS?.forEach((collection) => {
      const EXTERNAL_ID = collection?.external?.collection_id;
      if (EXTERNAL_ID) {
        AI_SEARCH_AND_ANALYSIS_COLLECTIONS_EXTERNAL_IDS.push(EXTERNAL_ID);
      }
    });

    const WATSON_DISCOVERY_SERVICE = getWatsonDiscoveryServiceByAiSearchAndAnalysisService(AI_SEARCH_AND_ANALYSIS_SERVICE);

    const EXTERNAL_PROJECT_ID = AI_SEARCH_AND_ANALYSIS_PROJECT?.external?.project_id;

    const PARAMS = {
      projectId: EXTERNAL_PROJECT_ID,
      collectionIds: AI_SEARCH_AND_ANALYSIS_COLLECTIONS_EXTERNAL_IDS,
      query: QUERY,
    };

    const RESPONSE = await WATSON_DISCOVERY_SERVICE.collections.queryMany(context, PARAMS);

    const RET_VAL = {};

    RET_VAL.external = RESPONSE.result;

    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(queryMany.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
};

module.exports = {
  queryMany,
};
