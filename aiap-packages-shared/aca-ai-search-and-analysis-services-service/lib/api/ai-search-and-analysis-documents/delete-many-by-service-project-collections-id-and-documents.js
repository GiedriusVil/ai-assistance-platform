/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-ai-search-and-analysis-services-service-ai-search-and-analysis-documents-delete-many-by-service-project-collection-id-and-documents';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const ramda = require('@ibm-aca/aca-wrapper-ramda');
const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { formatIntoAcaError, throwAcaError, ACA_ERROR_TYPE } = require('@ibm-aca/aca-utils-errors');
const { getDatasourceByContext } = require('../datasource.utils');

const { getRegistry } = require('@ibm-aca/aca-ai-search-and-analysis-service-adapter-provider');

const deleteManyByServiceProjectCollectionsAndDocuments = async (context, params) => {
  const AI_SEARCH_AND_ANALYSIS_SERVICE_ID = params?.aiSearchAndAnalysisServiceId;
  const AI_SEARCH_AND_ANALYSIS_PROJECT_ID = params?.aiSearchAndAnalysisProjectId;
  const AI_SEARCH_AND_ANALYSIS_COLLECTION_ID = params?.aiSearchAndAnalysisCollectionId;
  const AI_SEARCH_AND_ANALYSIS_DOCUMENTS = params?.aiSearchAndAnalysisDocuments;
  try {
    if (
      lodash.isEmpty(AI_SEARCH_AND_ANALYSIS_SERVICE_ID)
    ) {
      const MESSAGE = `Missing required params.aiSearchAndAnalysisServiceId parameter!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }
    if (
      lodash.isEmpty(AI_SEARCH_AND_ANALYSIS_PROJECT_ID)
    ) {
      const MESSAGE = `Missing required params.aiSearchAndAnalysisProjectId parameter!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }
    if (
      lodash.isEmpty(AI_SEARCH_AND_ANALYSIS_COLLECTION_ID)
    ) {
      const MESSAGE = `Missing required params.aiSearchAndAnalysisCollectionId parameter!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }
    if (
      !lodash.isArray(AI_SEARCH_AND_ANALYSIS_DOCUMENTS)
    ) {
      const MESSAGE = `Wrong type of params.aiSearchAndAnalysisDocuments! [Expected: Array]!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }

    const DATASOURCE = getDatasourceByContext(context);

    const PROMISES = [
      DATASOURCE.aiSearchAndAnalysisServices.findOneById(context, { id: AI_SEARCH_AND_ANALYSIS_SERVICE_ID }),
      DATASOURCE.aiSearchAndAnalysisProjects.findOneById(context, { id: AI_SEARCH_AND_ANALYSIS_PROJECT_ID }),
      DATASOURCE.aiSearchAndAnalysisCollections.findOneById(context, { id: AI_SEARCH_AND_ANALYSIS_COLLECTION_ID }),
    ];


    const [AI_SEARCH_AND_ANALYSIS_SERVICE, AI_SEARCH_AND_ANALYSIS_PROJECT, AI_SEARCH_AND_ANALYSIS_COLLECTION] = await Promise.all(PROMISES);

    if (lodash.isEmpty(AI_SEARCH_AND_ANALYSIS_SERVICE)) {
      const MESSAGE = `Unable to find AI_SEARCH_AND_ANALYSIS_SERVICE with id: ${AI_SEARCH_AND_ANALYSIS_SERVICE_ID}!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, MESSAGE);
    }

    if (lodash.isEmpty(AI_SEARCH_AND_ANALYSIS_PROJECT)) {
      const MESSAGE = `Unable to find AI_SEARCH_AND_ANALYSIS_PROJECT with id: ${AI_SEARCH_AND_ANALYSIS_PROJECT_ID}!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, MESSAGE);
    }

    if (lodash.isEmpty(AI_SEARCH_AND_ANALYSIS_COLLECTION)) {
      const MESSAGE = `Unable to find AI_SEARCH_AND_ANALYSIS_COLLECTION with id: ${AI_SEARCH_AND_ANALYSIS_COLLECTION_ID}!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, MESSAGE);
    }

    const AI_SEARCH_AND_ANALYSIS_SERVICE_ADAPTER = getRegistry()[AI_SEARCH_AND_ANALYSIS_SERVICE?.type];

    if (!lodash.isObject(AI_SEARCH_AND_ANALYSIS_SERVICE_ADAPTER)) {
      const MESSAGE = `Unsupported AI_SEARCH_AND_ANALYSIS_SERVICE_ADAPTER type! Given: ${AI_SEARCH_AND_ANALYSIS_SERVICE?.type}`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, MESSAGE);
    }

    const DELETE_PROMISES = AI_SEARCH_AND_ANALYSIS_DOCUMENTS?.map((aiSearchAndAnalysisDocument) => {
      return AI_SEARCH_AND_ANALYSIS_SERVICE_ADAPTER.documents.deleteOne(context, { 
        aiSearchAndAnalysisService: AI_SEARCH_AND_ANALYSIS_SERVICE, 
        aiSearchAndAnalysisProject: AI_SEARCH_AND_ANALYSIS_PROJECT,
        aiSearchAndAnalysisCollection: AI_SEARCH_AND_ANALYSIS_COLLECTION,
        aiSearchAndAnalysisDocument,
      });
    });

    await Promise.all(DELETE_PROMISES);

    const RET_VAL = {
      status: 'DELETE SUCCESS',
    };

    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(deleteManyByServiceProjectCollectionsAndDocuments.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
};

module.exports = {
  deleteManyByServiceProjectCollectionsAndDocuments,
}
