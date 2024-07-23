/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const AI_SEARCH_AND_ANALYSIS_PROJECT_TYPE = {
  DOCUMENT_RETRIEVAL: 'documentRetrieval',
  CONVERSATIONAL_SEARCH: 'conversationalSearch',
  OTHER: 'other',
};

/**
 * Converts WDS project types to AI Search and Analysis Project types
 * More info: https://cloud.ibm.com/apidocs/discovery-data?code=node#createproject
 */
const getProjectType = (watsonDiscoveryProject) => {
  const PROJECT_TYPE = watsonDiscoveryProject.type;

  let retVal;

  switch (PROJECT_TYPE) {
    case 'document_retrieval':
      retVal = AI_SEARCH_AND_ANALYSIS_PROJECT_TYPE.DOCUMENT_RETRIEVAL;
      break;
    case 'conversational_search':
      retVal = AI_SEARCH_AND_ANALYSIS_PROJECT_TYPE.CONVERSATIONAL_SEARCH;
      break;
    case 'content_intelligence':
    case 'content_mining':
    case 'other':
      retVal = AI_SEARCH_AND_ANALYSIS_PROJECT_TYPE.OTHER;
      break;
    default:
      retVal = AI_SEARCH_AND_ANALYSIS_PROJECT_TYPE.OTHER;
  }

  return retVal;
}

const getWatsonDiscoveryProjectType = (aiSearchAndAnalysisProject) => {
  const PROJECT_TYPE = aiSearchAndAnalysisProject.type;

  let retVal;

  switch (PROJECT_TYPE) {
    case AI_SEARCH_AND_ANALYSIS_PROJECT_TYPE.DOCUMENT_RETRIEVAL:
      retVal = 'document_retrieval';
      break;
    case AI_SEARCH_AND_ANALYSIS_PROJECT_TYPE.CONVERSATIONAL_SEARCH:
      retVal = 'conversational_search';
      break;
    default:
      retVal = AI_SEARCH_AND_ANALYSIS_PROJECT_TYPE.OTHER;
  }

  return retVal;
};

module.exports = {
  AI_SEARCH_AND_ANALYSIS_PROJECT_TYPE,
  getProjectType,
  getWatsonDiscoveryProjectType,
};
