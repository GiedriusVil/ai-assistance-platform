/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-ai-search-and-analysis-services-service-ai-search-and-analysis-collections-save-one';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const { formatIntoAcaError, appendDataToError, throwAcaError, ACA_ERROR_TYPE } = require('@ibm-aca/aca-utils-errors');
const { getDatasourceByContext } = require('../datasource.utils');

const { getRegistry } = require('@ibm-aca/aca-ai-search-and-analysis-service-adapter-provider');
const lodash = require('@ibm-aca/aca-wrapper-lodash');

const saveOne = async (context, params) => {
  const USER_ID = context?.user?.id;
  const AI_SEARCH_AND_ANALYSIS_COLLECTION = params?.aiSearchAndAnalysisCollection;
  const AI_SEARCH_AND_ANALYSIS_SERVICE_ID = params?.aiSearchAndAnalysisServiceId;
  const AI_SEARCH_AND_ANALYSIS_PROJECT_ID = params?.aiSearchAndAnalysisProjectId;
  const AI_SEARCH_AND_ANALYSIS_COLLECTION_NAME = AI_SEARCH_AND_ANALYSIS_COLLECTION?.name;
  const AI_SEARCH_AND_ANALYSIS_COLLECTION_LANGUAGE = AI_SEARCH_AND_ANALYSIS_COLLECTION?.language;
  const IS_IMPORT = params?.isImport;
  try {
    if (lodash.isEmpty(AI_SEARCH_AND_ANALYSIS_SERVICE_ID)) {
      const MESSAGE = `Missing params.aiSearchAndAnalysisServiceId`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }
    if (lodash.isEmpty(AI_SEARCH_AND_ANALYSIS_PROJECT_ID)) {
      const MESSAGE = `Missing params.aiSearchAndAnalysisProjectId`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }
    if (lodash.isEmpty(AI_SEARCH_AND_ANALYSIS_COLLECTION_NAME)) {
      const MESSAGE = `Missing params.aiSearchAndAnalysisCollection.name`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }
    if (lodash.isEmpty(AI_SEARCH_AND_ANALYSIS_COLLECTION_LANGUAGE)) {
      const MESSAGE = `Missing params.aiSearchAndAnalysisCollection.language`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }

    const DATASOURCE = getDatasourceByContext(context);

    const [AI_SEARCH_AND_ANALYSIS_SERVICE, AI_SEARCH_AND_ANALYSIS_PROJECT] = await Promise.all([
      DATASOURCE.aiSearchAndAnalysisServices.findOneById(context, { id: AI_SEARCH_AND_ANALYSIS_SERVICE_ID }),
      DATASOURCE.aiSearchAndAnalysisProjects.findOneById(context, { id: AI_SEARCH_AND_ANALYSIS_PROJECT_ID }),
    ]);

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

    const CREATE_ONE_PARAMS = {
      aiSearchAndAnalysisService: AI_SEARCH_AND_ANALYSIS_SERVICE,
      aiSearchAndAnalysisProject: AI_SEARCH_AND_ANALYSIS_PROJECT,
      aiSearchAndAnalysisCollection: AI_SEARCH_AND_ANALYSIS_COLLECTION,
      isImport: IS_IMPORT,
    };

    const RESPONSE = await AI_SEARCH_AND_ANALYSIS_SERVICE_ADAPTER.collections.createOne(context, CREATE_ONE_PARAMS);

    AI_SEARCH_AND_ANALYSIS_COLLECTION.external = RESPONSE;
    AI_SEARCH_AND_ANALYSIS_COLLECTION.serviceId = AI_SEARCH_AND_ANALYSIS_SERVICE_ID;
    AI_SEARCH_AND_ANALYSIS_COLLECTION.projectId = AI_SEARCH_AND_ANALYSIS_PROJECT_ID;

    const RET_VAL = await DATASOURCE.aiSearchAndAnalysisCollections.saveOne(context, params);
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, { USER_ID });
    logger.error('->', { ACA_ERROR });
    throw ACA_ERROR;
  }
};

module.exports = {
  saveOne,
};
