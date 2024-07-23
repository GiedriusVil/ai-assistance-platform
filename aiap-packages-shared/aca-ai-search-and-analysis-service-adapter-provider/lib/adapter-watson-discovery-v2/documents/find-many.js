/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-ai-search-and-analysis-service-adapter-provider-adapter-watson-discovery-v2-documents-find-many';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const lodash = require('@ibm-aca/aca-wrapper-lodash');
const ramda = require('@ibm-aca/aca-wrapper-ramda');

const { formatIntoAcaError, throwAcaError, ACA_ERROR_TYPE } = require('@ibm-aca/aca-utils-errors');

const { getWatsonDiscoveryServiceByAiSearchAndAnalysisService } = require('@ibm-aca/aca-watson-discovery-provider');

const uuidv4 = require('uuid/v4');
const { appendAuditInfo } = require('@ibm-aiap/aiap-utils-audit');

const findMany = async (context, params) => {
  const AI_SEARCH_AND_ANALYSIS_SERVICE = params?.aiSearchAndAnalysisService;
  const AI_SEARCH_AND_ANALYSIS_PROJECT = params?.aiSearchAndAnalysisProject;
  const AI_SEARCH_AND_ANALYSIS_COLLECTION = params?.aiSearchAndAnalysisCollection;
  const SEARCH = params?.search;
  try {
    if (lodash.isEmpty(AI_SEARCH_AND_ANALYSIS_SERVICE)) {
      const MESSAGE = 'Missing required params.aiSearchAndAnalysisService parameter';
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }
    if (lodash.isEmpty(AI_SEARCH_AND_ANALYSIS_PROJECT)) {
      const MESSAGE = 'Missing required params.aiSearchAndAnalysisProject parameter';
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, MESSAGE);
    }
    if (lodash.isEmpty(AI_SEARCH_AND_ANALYSIS_COLLECTION)) {
      const MESSAGE = 'Missing required params.aiSearchAndAnalysisProject parameter';
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, MESSAGE);
    }

    const WATSON_DISCOVERY_SERVICE = getWatsonDiscoveryServiceByAiSearchAndAnalysisService(AI_SEARCH_AND_ANALYSIS_SERVICE);

    const EXTERNAL_PROJECT_ID = AI_SEARCH_AND_ANALYSIS_PROJECT?.external?.project_id;
    const EXTERNAL_COLLECTION_ID = AI_SEARCH_AND_ANALYSIS_COLLECTION?.external?.collection_id;

    const PARAMS = {
      projectId: EXTERNAL_PROJECT_ID,
      collectionIds: [EXTERNAL_COLLECTION_ID],
      naturalLanguageQuery: `extracted_metadata.filename="${SEARCH}"`,
    };

    const RESPONSE = await WATSON_DISCOVERY_SERVICE.documents.findMany(context, PARAMS);

    const RET_VAL = [];

    RESPONSE?.result?.results?.forEach((document) => {
      const AI_SEARCH_AND_ANALYSIS_DOCUMENT = {
        id: uuidv4(),
        name: document?.extracted_metadata?.filename,
        external: {
          document_id: document?.document_id,
          result_metadata: document?.result_metadata,
          metadata: document?.metadata
        },
        type: document?.extracted_metadata?.file_type,
      };
      appendAuditInfo(context, AI_SEARCH_AND_ANALYSIS_DOCUMENT);
      RET_VAL.push(AI_SEARCH_AND_ANALYSIS_DOCUMENT);
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
