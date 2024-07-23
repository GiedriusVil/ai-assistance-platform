/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-test-cases-service-test-cases-import-many';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const ramda = require('@ibm-aca/aca-wrapper-ramda');
const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { formatIntoAcaError, ACA_ERROR_TYPE, throwAcaError } = require('@ibm-aca/aca-utils-errors');

const { readJsonFromFile } = require('../../utils/json-file-utils');
const { saveOne } = require('./save-one');

const importMany = async (context, params) => {
  try {
    const FILE = params?.file;
    const TEST_CASES_FROM_FILE = await readJsonFromFile(FILE);

    if (
      lodash.isEmpty(TEST_CASES_FROM_FILE)
    ) {
      const MESSAGE = 'Missing test cases in file!';
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }
    const HAS_PROPER_FILE_STRUCTURE = TEST_CASES_FROM_FILE.every(
      tenant => lodash.has(tenant, 'id')
    );

    if (
      !HAS_PROPER_FILE_STRUCTURE
    ) {
      const MESSAGE = `Test cases are not compatible for import! File must contain 'id'!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }

    const PROMISES = [];
    for (let testCase of TEST_CASES_FROM_FILE) {
      PROMISES.push(saveOne(context, { testCase }));
    }
    await Promise.all(PROMISES);
    const RET_VAL = {
      status: 'SUCCESS'
    }
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(`${importMany.name}`, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

module.exports = {
  importMany,
}
