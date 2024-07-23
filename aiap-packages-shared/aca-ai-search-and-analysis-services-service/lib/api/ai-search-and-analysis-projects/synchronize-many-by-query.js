/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-ai-search-and-analysis-services-service-ai-search-and-analysis-projects-synchronize-many-by-query';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { formatIntoAcaError, throwAcaError, ACA_ERROR_TYPE } = require('@ibm-aca/aca-utils-errors');
const { getDatasourceByContext } = require('../datasource.utils');

const { getRegistry } = require('@ibm-aca/aca-ai-search-and-analysis-service-adapter-provider');

const synchronizeManyByQuery = async (context, params) => {
  const AI_SEARCH_AND_ANALYSIS_SERVICE_ID = params?.filter?.aiSearchAndAnalysisServiceId;
  try {
    if (lodash.isEmpty(AI_SEARCH_AND_ANALYSIS_SERVICE_ID)) {
      const MESSAGE = 'Missing required params.filter.aiSearchAndAnalysisServiceId parameter';
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }
    const DATASOURCE = getDatasourceByContext(context);

    const PROJECTS_PARAMS = {
      filter: {
        aiSearchAndAnalysisServiceId: AI_SEARCH_AND_ANALYSIS_SERVICE_ID,
      },
      pagination: { page: 1, size: 9999 },
      type: 'AiSearchAndAnalysisServices',
      sort: { field: 'name', direction: 'desc' }
    };

    const [AI_SEARCH_AND_ANALYSIS_SERVICE, AI_SEARCH_AND_ANALYSIS_PROJECTS_DATA] = await Promise.all([
      DATASOURCE.aiSearchAndAnalysisServices.findOneById(context, { id: AI_SEARCH_AND_ANALYSIS_SERVICE_ID }),
      DATASOURCE.aiSearchAndAnalysisProjects.findManyByQuery(context, PROJECTS_PARAMS),
    ]);

    if (lodash.isEmpty(AI_SEARCH_AND_ANALYSIS_SERVICE)) {
      const MESSAGE = `Unable to find AI_SEARCH_AND_ANALYSIS_SERVICE with id: ${AI_SEARCH_AND_ANALYSIS_SERVICE_ID}!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, MESSAGE);
    }

    const AI_SEARCH_AND_ANALYSIS_SERVICE_ADAPTER = getRegistry()[AI_SEARCH_AND_ANALYSIS_SERVICE?.type];

    if (!lodash.isObject(AI_SEARCH_AND_ANALYSIS_SERVICE_ADAPTER)) {
      const MESSAGE = `Unsupported AI_SEARCH_AND_ANALYSIS_SERVICE_ADAPTER type!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, MESSAGE);
    }

    const PARAMS = {
      aiSearchAndAnalysisService: AI_SEARCH_AND_ANALYSIS_SERVICE,
      aiSearchAndAnalysisProjects: AI_SEARCH_AND_ANALYSIS_PROJECTS_DATA?.items || [],
    };

    const RESPONSE = await AI_SEARCH_AND_ANALYSIS_SERVICE_ADAPTER.projects.findMany(context, PARAMS);

    const PROMISES = RESPONSE.map((project) => {
      project.serviceId = AI_SEARCH_AND_ANALYSIS_SERVICE_ID;
      const RET_VAL = DATASOURCE.aiSearchAndAnalysisProjects.saveOne(context, {
        aiSearchAndAnalysisProject: project,
      });
      return RET_VAL;
    });

    await Promise.all(PROMISES);

    const RET_VAL = DATASOURCE.aiSearchAndAnalysisProjects.findManyByQuery(context, params);

    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error('->', { ACA_ERROR });
    throw ACA_ERROR;
  }
}

module.exports = {
  synchronizeManyByQuery,
}
