/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-ai-search-and-analysis-service-adapter-provider-adapter-watson-discovery-v2-collections-create-one';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const lodash = require('@ibm-aca/aca-wrapper-lodash');
const ramda = require('@ibm-aca/aca-wrapper-ramda');

const { getWatsonDiscoveryServiceByAiSearchAndAnalysisService } = require('@ibm-aca/aca-watson-discovery-provider');

const { formatIntoAcaError, throwAcaError, ACA_ERROR_TYPE } = require('@ibm-aca/aca-utils-errors');

const createOne = async (context, params) => {
  const AI_SEARCH_AND_ANALYSIS_SERVICE = params?.aiSearchAndAnalysisService;
  const AI_SEARCH_AND_ANALYSIS_PROJECT = params?.aiSearchAndAnalysisProject;
  const AI_SEARCH_AND_ANALYSIS_COLLECTION = params?.aiSearchAndAnalysisCollection;
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
    if (
      lodash.isEmpty(AI_SEARCH_AND_ANALYSIS_COLLECTION)
    ) {
      const MESSAGE = 'Missing required params.aiSearchAndAnalysisCollection parameter';
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, MESSAGE);
    }

    const NAME = AI_SEARCH_AND_ANALYSIS_COLLECTION?.name;
    const DESCRIPTION = AI_SEARCH_AND_ANALYSIS_COLLECTION?.description;
    const LANGUAGE = AI_SEARCH_AND_ANALYSIS_COLLECTION?.language;

    if (
      lodash.isEmpty(NAME)
    ) {
      const MESSAGE = 'Missing required aiSearchAndAnalysisProject.name parameter';
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }

    if (
      lodash.isEmpty(DESCRIPTION)
    ) {
      const MESSAGE = 'Missing required aiSearchAndAnalysisProject.description parameter';
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }

    if (lodash.isEmpty(LANGUAGE)) {
      const MESSAGE = 'Missing required aiSearchAndAnalysisProject.language parameter';
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }

    const WATSON_DISCOVERY_SERVICE = getWatsonDiscoveryServiceByAiSearchAndAnalysisService(AI_SEARCH_AND_ANALYSIS_SERVICE);

    let response;
    /*
    * In case of import there might be situation when id and external.collection_id
    * will exist, but external.collection_id might be from different service.
    * updateOne function might throw 404 error, which could be confusing
    */
    if (
      lodash.isEmpty(AI_SEARCH_AND_ANALYSIS_COLLECTION.id) || IS_IMPORT
    ) {
      const PARAMS = {
        name: NAME,
        description: DESCRIPTION,
        language: LANGUAGE,
        projectId: AI_SEARCH_AND_ANALYSIS_PROJECT.external.project_id,
      }

      response = await WATSON_DISCOVERY_SERVICE.collections.createOne(context, PARAMS);
    } else {
      const PARAMS = {
        name: NAME,
        description: DESCRIPTION,
        collectionId: AI_SEARCH_AND_ANALYSIS_COLLECTION.external.collection_id,
        projectId: AI_SEARCH_AND_ANALYSIS_PROJECT.external.project_id,
      }

      response = await WATSON_DISCOVERY_SERVICE.collections.updateOne(context, PARAMS);
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
