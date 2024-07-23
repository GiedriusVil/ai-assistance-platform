/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'ai-search-and-analysis-services-datasource-mongo-ai-search-and-analysis-collections-save-one';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const ramda = require('@ibm-aca/aca-wrapper-ramda');
const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { v4: uuidv4 } = require('uuid');

const { appendDataToError, formatIntoAcaError, throwAcaError, ACA_ERROR_TYPE } = require('@ibm-aca/aca-utils-errors');
const { findOneById } = require('./find-one-by-id');
const { appendAuditInfo } = require('@ibm-aiap/aiap-utils-audit');

const saveOne = async (datasource, context, params) => {
  const USER = context?.user;
  const USER_ID = USER?.id;
  const AI_SEARCH_AND_ANALYSIS_COLLECTION = params?.aiSearchAndAnalysisCollection;
  const AI_SEARCH_AND_ANALYSIS_COLLECTION_ID = ramda.pathOr(uuidv4(), ['id'], AI_SEARCH_AND_ANALYSIS_COLLECTION);
  const COLLECTION = datasource._collections.aiSearchAndAnalysisCollections;

  let filter;
  try {
    if (
      lodash.isEmpty(AI_SEARCH_AND_ANALYSIS_COLLECTION)
    ) {
      const MESSAGE = `Missing required params.aiSearchAndAnalysisCollection paramater!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }

    appendAuditInfo(context, AI_SEARCH_AND_ANALYSIS_COLLECTION);

    delete AI_SEARCH_AND_ANALYSIS_COLLECTION.id;
    filter = { _id: AI_SEARCH_AND_ANALYSIS_COLLECTION_ID };
    const UPDATE_SET_CONDITION = { $set: AI_SEARCH_AND_ANALYSIS_COLLECTION };
    const UPDATE_OPTIONS = { upsert: true };

    const ACA_MONGO_CLIENT = await datasource._getAcaMongoClient();
    await ACA_MONGO_CLIENT
      .__updateOne(context,
        {
          collection: COLLECTION,
          filter: filter,
          update: UPDATE_SET_CONDITION,
          options: UPDATE_OPTIONS
        });

    const RET_VAL = await findOneById(datasource, context, { id: AI_SEARCH_AND_ANALYSIS_COLLECTION_ID });
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, { USER_ID, AI_SEARCH_AND_ANALYSIS_COLLECTION_ID, filter });
    logger.error(saveOne.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

module.exports = {
  saveOne,
};
