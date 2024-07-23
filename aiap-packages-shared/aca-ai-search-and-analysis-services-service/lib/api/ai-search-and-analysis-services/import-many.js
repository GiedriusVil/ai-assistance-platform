/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-ai-search-and-analysis-services-service-ai-search-and-analysis-services-import-many';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const ramda = require('@ibm-aca/aca-wrapper-ramda');
const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { formatIntoAcaError, ACA_ERROR_TYPE, throwAcaError, appendDataToError } = require('@ibm-aca/aca-utils-errors');

const { readJsonFromFile } = require('@ibm-aiap/aiap-utils-file');
const { saveOne } = require('./save-one');

const importMany = async (context, params) => {
  const CONTEXT_USER_ID = context?.user?.id;

  let file;
  let recordsFromFile;

  try {
    file = params?.file;
    recordsFromFile = await readJsonFromFile(file);
    if (
      lodash.isEmpty(recordsFromFile)
    ) {
      const MESSAGE = 'Missing required params.file paramater!';
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }
    const HAS_PROPER_FILE_STRUCTURE = recordsFromFile.every(
      (record) => lodash.has(record, 'name') && lodash.has(record, 'type')
    );
    if (
      !HAS_PROPER_FILE_STRUCTURE
    ) {
      const MESSAGE = `Records are not compatible for import! Records must contain 'name' and 'type' attribute!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }
    const PROMISES = [];
    for (let aiSearchAndAnalysisService of recordsFromFile) {
      PROMISES.push(saveOne(context, { aiSearchAndAnalysisService }));
    }
    await Promise.all(PROMISES);
    const RET_VAL = {
      status: 'IMPORT SUCCESS'
    }
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
