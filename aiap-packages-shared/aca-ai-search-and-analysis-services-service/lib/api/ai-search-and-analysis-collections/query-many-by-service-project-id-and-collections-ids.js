/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-ai-search-and-analysis-services-service-ai-search-and-analysis-collections-query-many-by-service-project-id-and-collections-ids';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const ramda = require('@ibm-aca/aca-wrapper-ramda');
const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { formatIntoAcaError, throwAcaError, ACA_ERROR_TYPE } = require('@ibm-aca/aca-utils-errors');
const { getDatasourceByContext } = require('../datasource.utils');

const { getRegistry } = require('@ibm-aca/aca-ai-search-and-analysis-service-adapter-provider');

const queryManyByServiceProjectIdAndCollectionsIds = async (context, params) => {
  const AI_SEARCH_AND_ANALYSIS_SERVICE_ID = params?.aiSearchAndAnalysisServiceId;
  const AI_SEARCH_AND_ANALYSIS_PROJECT_ID = params?.aiSearchAndAnalysisProjectId;
  const QUERY = params?.query;
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
      lodash.isEmpty(QUERY)
    ) {
      const MESSAGE = `Missing required params.query parameter!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }

    const DATASOURCE = getDatasourceByContext(context);
    let ids = params?.ids;

    if (
      lodash.isEmpty(ids)
    ) {
      ids = [];
    }

    if (
      !lodash.isArray(ids)
    ) {
      const MESSAGE = 'Wrong type of params.ids! [Expected: Array]';
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, MESSAGE);
    }

    const PROMISES = [
      DATASOURCE.aiSearchAndAnalysisServices.findOneById(context, { id: AI_SEARCH_AND_ANALYSIS_SERVICE_ID }),
      DATASOURCE.aiSearchAndAnalysisProjects.findOneById(context, { id: AI_SEARCH_AND_ANALYSIS_PROJECT_ID }),
    ];

    ids.forEach((id) => {
      PROMISES.push(DATASOURCE.aiSearchAndAnalysisCollections.findOneById(context, { id }));
    });

    const [AI_SEARCH_AND_ANALYSIS_SERVICE, AI_SEARCH_AND_ANALYSIS_PROJECT, ...AI_SEARCH_AND_ANALYSIS_COLLECTIONS] = await Promise.all(PROMISES);

    if (lodash.isEmpty(AI_SEARCH_AND_ANALYSIS_SERVICE)) {
      const MESSAGE = `Unable to find AI_SEARCH_AND_ANALYSIS_SERVICE with id: ${AI_SEARCH_AND_ANALYSIS_SERVICE_ID}!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, MESSAGE);
    }

    if (lodash.isEmpty(AI_SEARCH_AND_ANALYSIS_PROJECT)) {
      const MESSAGE = `Unable to find AI_SEARCH_AND_ANALYSIS_PROJECT with id: ${AI_SEARCH_AND_ANALYSIS_PROJECT_ID}!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, MESSAGE);
    }

    const AI_SEARCH_AND_ANALYSIS_SERVICE_ADAPTER = getRegistry()[AI_SEARCH_AND_ANALYSIS_SERVICE?.type];

    if (!lodash.isObject(AI_SEARCH_AND_ANALYSIS_SERVICE_ADAPTER)) {
      const MESSAGE = `Unsupported AI_SEARCH_AND_ANALYSIS_SERVICE_ADAPTER type! Given: ${AI_SEARCH_AND_ANALYSIS_SERVICE?.type}`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, MESSAGE);
    }

    const RET_VAL = AI_SEARCH_AND_ANALYSIS_SERVICE_ADAPTER.collections.queryMany(context, { 
      aiSearchAndAnalysisService: AI_SEARCH_AND_ANALYSIS_SERVICE, 
      aiSearchAndAnalysisProject: AI_SEARCH_AND_ANALYSIS_PROJECT,
      aiSearchAndAnalysisCollections: AI_SEARCH_AND_ANALYSIS_COLLECTIONS,
      query: QUERY,
    });

    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(queryManyByServiceProjectIdAndCollectionsIds.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
};

module.exports = {
  queryManyByServiceProjectIdAndCollectionsIds,
}
