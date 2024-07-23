/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-ai-search-and-analysis-services-datasource-mongo-collections-utils';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const ramda = require('@ibm-aca/aca-wrapper-ramda');
const lodash = require('@ibm-aca/aca-wrapper-lodash');

const DEFAULT_COLLECTIONS = {
  aiSearchAndAnalysisServices: 'aiSearchAndAnalysisServices',
  aiSearchAndAnalysisProjects: 'aiSearchAndAnalysisProjects',
  aiSearchAndAnalysisCollections: 'aiSearchAndAnalysisCollections',
};

const sanitizedCollectionsFromConfiguration = (configuration) => {
  const COLLECTIONS_CONFIGURATION = ramda.path(['collections'], configuration);

  const AI_SEARCH_AND_ANALYSIS_SERVICES = ramda.path(['aiSearchAndAnalysisServices'], COLLECTIONS_CONFIGURATION);
  const AI_SEARCH_AND_ANALYSIS_PROJECTS = ramda.path(['aiSearchAndAnalysisProjects'], COLLECTIONS_CONFIGURATION);
  const AI_SEARCH_AND_ANALYSIS_COLLECTIONS = ramda.path(['aiSearchAndAnalysisCollections'], COLLECTIONS_CONFIGURATION);

  const RET_VAL = lodash.cloneDeep(DEFAULT_COLLECTIONS);
  if (
    !lodash.isEmpty(AI_SEARCH_AND_ANALYSIS_SERVICES)
  ) {
    RET_VAL.aiSearchAndAnalysisServices = AI_SEARCH_AND_ANALYSIS_SERVICES;
  }
  if (
    !lodash.isEmpty(AI_SEARCH_AND_ANALYSIS_PROJECTS)
  ) {
    RET_VAL.aiSearchAndAnalysisProjects = AI_SEARCH_AND_ANALYSIS_PROJECTS;
  }
  if (
    !lodash.isEmpty(AI_SEARCH_AND_ANALYSIS_COLLECTIONS)
  ) {
    RET_VAL.aiSearchAndAnalysisCollections = AI_SEARCH_AND_ANALYSIS_COLLECTIONS;
  }

  return RET_VAL;
}


module.exports = {
  sanitizedCollectionsFromConfiguration,
};
