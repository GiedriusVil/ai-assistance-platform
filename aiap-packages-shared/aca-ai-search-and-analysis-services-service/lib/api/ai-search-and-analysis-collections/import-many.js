/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-ai-search-and-analysis-services-service-ai-search-and-analysis-collections-import-many';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const ramda = require('@ibm-aca/aca-wrapper-ramda');
const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { formatIntoAcaError, ACA_ERROR_TYPE, throwAcaError, appendDataToError } = require('@ibm-aca/aca-utils-errors');

const { readJsonFromFile } = require('@ibm-aiap/aiap-utils-file');
const { saveOne } = require('./save-one');

const importMany = async (context, params) => {
  const CONTEXT_USER_ID = context?.user?.id;
  const AI_SEARCH_AND_ANALYSIS_SERVICE_ID = params?.aiSearchAndAnalysisServiceId;
  const AI_SEARCH_AND_ANALYSIS_PROJECT_ID = params?.aiSearchAndAnalysisProjectId;

  let file;
  let recordsFromFile;

  try {
    if (
      lodash.isEmpty(AI_SEARCH_AND_ANALYSIS_SERVICE_ID)
    ) {
      const MESSAGE = 'Missing required params.aiSearchAndAnalysisServiceId paramater!';
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }
    if (
      lodash.isEmpty(AI_SEARCH_AND_ANALYSIS_PROJECT_ID)
    ) {
      const MESSAGE = 'Missing required params.aiSearchAndAnalysisProjectId paramater!';
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }
    file = params?.file;
    recordsFromFile = await readJsonFromFile(file);

    if (
      lodash.isEmpty(recordsFromFile)
    ) {
      const MESSAGE = 'Missing required params.file paramater!';
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }
    const HAS_PROPER_FILE_STRUCTURE = recordsFromFile.every(
      (record) => lodash.has(record, 'name') && lodash.has(record, 'description') && lodash.has(record, 'language')
    );
    if (
      !HAS_PROPER_FILE_STRUCTURE
    ) {
      const MESSAGE = `Records are not compatible for import! Records must contain 'name' attribute!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }
    const PROMISES = [];
    for (let aiSearchAndAnalysisCollection of recordsFromFile) {
      PROMISES.push(saveOne(context, {
        aiSearchAndAnalysisServiceId: AI_SEARCH_AND_ANALYSIS_SERVICE_ID,
        aiSearchAndAnalysisProjectId: AI_SEARCH_AND_ANALYSIS_PROJECT_ID,
        aiSearchAndAnalysisCollection,
        isImport: true,
      }));
    }
    await Promise.all(PROMISES);
    const RET_VAL = {
      status: 'IMPORT SUCCESS'
    };
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, { CONTEXT_USER_ID });
    logger.error(`${importMany.name}`, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

module.exports = {
  importMany,
}
