/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-ai-search-and-analysis-services-datasource-mongo-ai-search-and-analysis-collections-delete-many-by-project-id';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const ramda = require('@ibm-aca/aca-wrapper-ramda');
const lodash = require('@ibm-aca/aca-wrapper-lodash');

const ReadPreference = require('mongodb').ReadPreference;

const { formatIntoAcaError, throwAcaError, appendDataToError, ACA_ERROR_TYPE } = require('@ibm-aca/aca-utils-errors');

const deleteManyByProjectId = async (datasource, context, params) => {
  const USER_ID = context?.user?.id;
  const AI_SEARCH_AND_ANALYSIS_PROJECT_ID = params?.aiSearchAndAnalysisProjectId;

  const COLLECTION = datasource._collections.aiSearchAndAnalysisCollections;
  const COLLECTION_OPTIONS = { readPreference: ReadPreference.PRIMARY };

  let filter;
  try {
    if (
      lodash.isEmpty(AI_SEARCH_AND_ANALYSIS_PROJECT_ID)
    ) {
      const MESSAGE = `Missing required params.aiSearchAndAnalysisProjectId parameter!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }

    filter = {
      projectId: {
        $eq: AI_SEARCH_AND_ANALYSIS_PROJECT_ID,
      }
    };

    const ACA_MONGO_CLIENT = await datasource._getAcaMongoClient();
    await ACA_MONGO_CLIENT
      .__deleteMany(context, {
        collection: COLLECTION,
        collectionOptions: COLLECTION_OPTIONS,
        filter: filter
      });

    const RET_VAL = {
      aiSearchAndAnalysisProjectId: AI_SEARCH_AND_ANALYSIS_PROJECT_ID,
      status: 'SUCCESS'
    };
    
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, { USER_ID, AI_SEARCH_AND_ANALYSIS_PROJECT_ID, filter });
    logger.error(deleteManyByProjectId.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

module.exports = {
  deleteManyByProjectId
}
