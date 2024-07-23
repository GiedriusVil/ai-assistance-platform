/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-ai-search-and-analysis-service-adapter-provider-adapter-watson-discovery-v2-collections-find-many';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const lodash = require('@ibm-aca/aca-wrapper-lodash');
const ramda = require('@ibm-aca/aca-wrapper-ramda');

const { formatIntoAcaError, throwAcaError, ACA_ERROR_TYPE } = require('@ibm-aca/aca-utils-errors');

const { getWatsonDiscoveryServiceByAiSearchAndAnalysisService } = require('@ibm-aca/aca-watson-discovery-provider');

const findMany = async (context, params) => {
  const AI_SEARCH_AND_ANALYSIS_SERVICE = params?.aiSearchAndAnalysisService;
  const AI_SEARCH_AND_ANALYSIS_PROJECT = params?.aiSearchAndAnalysisProject;
  const AI_SEARCH_AND_ANALYSIS_COLLECTIONS = params?.aiSearchAndAnalysisCollections;

  try {
    if (lodash.isEmpty(AI_SEARCH_AND_ANALYSIS_SERVICE)) {
      const MESSAGE = 'Missing required params.aiSearchAndAnalysisService parameter';
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }
    if (lodash.isArray(AI_SEARCH_AND_ANALYSIS_PROJECT)) {
      const MESSAGE = 'Missing required params.aiSearchAndAnalysisProject parameter';
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, MESSAGE);
    }
    if (!lodash.isArray(AI_SEARCH_AND_ANALYSIS_COLLECTIONS)) {
      const MESSAGE = 'Wrong type of params.aiSearchAndAnalysisCollections! [Expected: Array]';
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, MESSAGE);
    }

    const AI_SEARCH_AND_ANALYSIS_COLLECTIONS_EXTERNAL_IDS = new Set();

    AI_SEARCH_AND_ANALYSIS_COLLECTIONS?.forEach((collection) => {
      const EXTERNAL_ID = collection?.external?.collection_id;
      if (EXTERNAL_ID) {
        AI_SEARCH_AND_ANALYSIS_COLLECTIONS_EXTERNAL_IDS.add(EXTERNAL_ID);
      }
    });

    const WATSON_DISCOVERY_SERVICE = getWatsonDiscoveryServiceByAiSearchAndAnalysisService(AI_SEARCH_AND_ANALYSIS_SERVICE);

    const EXTERNAL_PROJECT_ID = AI_SEARCH_AND_ANALYSIS_PROJECT?.external?.project_id;

    const PARAMS = {
      projectId: EXTERNAL_PROJECT_ID,
    };

    const RESPONSE = await WATSON_DISCOVERY_SERVICE.collections.findMany(context, PARAMS);

    const RET_VAL = [];
    const COLLECTIONS_DETAILS_PROMISES = []; 

    RESPONSE?.result?.collections?.forEach((collection) => {
      if (!AI_SEARCH_AND_ANALYSIS_COLLECTIONS_EXTERNAL_IDS.has(collection?.collection_id)) {
        const PARAMS = {
          projectId: EXTERNAL_PROJECT_ID,
          collectionId: collection.collection_id,
        };
        COLLECTIONS_DETAILS_PROMISES.push(WATSON_DISCOVERY_SERVICE.collections.findOne(context, PARAMS));
      }
    });

    const COLLECTIONS_DETAILS = await Promise.all(COLLECTIONS_DETAILS_PROMISES);

    COLLECTIONS_DETAILS.forEach((item) => {
      const AI_SEARCH_AND_ANALYSIS_COLLECTION = {
        name: item.result.name,
        description: item.result.description,
        language: item.result.language,
        external: item.result,
      };
      RET_VAL.push(AI_SEARCH_AND_ANALYSIS_COLLECTION);
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
