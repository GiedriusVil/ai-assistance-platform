/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-ai-search-and-analysis-services-service-ai-search-and-analysis-projects-delete-many-by-ids';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const ramda = require('@ibm-aca/aca-wrapper-ramda');
const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { formatIntoAcaError, throwAcaError, ACA_ERROR_TYPE } = require('@ibm-aca/aca-utils-errors');
const { getDatasourceByContext } = require('../datasource.utils');

const { getRegistry } = require('@ibm-aca/aca-ai-search-and-analysis-service-adapter-provider');

const deleteManyByServiceIdAndProjectIds = async (context, params) => {
  const AI_SEARCH_AND_ANALYSIS_SERVICE_ID = params?.aiSearchAndAnalysisServiceId;
  try {
    if (
      lodash.isEmpty(AI_SEARCH_AND_ANALYSIS_SERVICE_ID)
    ) {
      const MESSAGE = `Missing required params.aiSearchAndAnalysisServiceId parameter!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }

    const DATASOURCE = getDatasourceByContext(context);
    const IDS = params?.ids;

    if (
      lodash.isEmpty(IDS)
    ) {
      const MESSAGE = `Missing required params.ids parameter!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }

    if (
      !lodash.isArray(IDS)
    ) {
      const MESSAGE = 'Wrong type of params.ids! [Expected: Array]';
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, MESSAGE);
    }

    const PROMISES = [DATASOURCE.aiSearchAndAnalysisServices.findOneById(context, { id: AI_SEARCH_AND_ANALYSIS_SERVICE_ID })];

    IDS.forEach((id) => {
      PROMISES.push(DATASOURCE.aiSearchAndAnalysisProjects.findOneById(context, { id }));
    });

    const [AI_SEARCH_AND_ANALYSIS_SERVICE, ...AI_SEARCH_AND_ANALYSIS_PROJECTS] = await Promise.all(PROMISES);

    if (lodash.isEmpty(AI_SEARCH_AND_ANALYSIS_SERVICE)) {
      const MESSAGE = `Unable to find AI_SEARCH_AND_ANALYSIS_SERVICE with id: ${AI_SEARCH_AND_ANALYSIS_SERVICE_ID}!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, MESSAGE);
    }

    const AI_SEARCH_AND_ANALYSIS_SERVICE_ADAPTER = getRegistry()[AI_SEARCH_AND_ANALYSIS_SERVICE?.type];

    if (!lodash.isObject(AI_SEARCH_AND_ANALYSIS_SERVICE_ADAPTER)) {
      const MESSAGE = `Unsupported AI_SEARCH_AND_ANALYSIS_SERVICE_ADAPTER type! Given: ${AI_SEARCH_AND_ANALYSIS_SERVICE?.type}`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, MESSAGE);
    }

    const COLLECTIONS_DELETE_PROMISES = [];
    const DELETE_PROMISES = AI_SEARCH_AND_ANALYSIS_PROJECTS.map((aiSearchAndAnalysisProject) => {
      COLLECTIONS_DELETE_PROMISES.push(DATASOURCE.aiSearchAndAnalysisCollections.deleteManyByProjectId(context, { aiSearchAndAnalysisProjectId: aiSearchAndAnalysisProject.id }));
      return AI_SEARCH_AND_ANALYSIS_SERVICE_ADAPTER.projects.deleteOne(context, { aiSearchAndAnalysisService: AI_SEARCH_AND_ANALYSIS_SERVICE, aiSearchAndAnalysisProject });
    });

    await Promise.all(DELETE_PROMISES);

    await Promise.all(COLLECTIONS_DELETE_PROMISES);
    const RET_VAL = await DATASOURCE.aiSearchAndAnalysisProjects.deleteManyByIds(context, params);
  
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error('->', { ACA_ERROR });
    throw ACA_ERROR;
  }
};

module.exports = {
  deleteManyByServiceIdAndProjectIds,
}
