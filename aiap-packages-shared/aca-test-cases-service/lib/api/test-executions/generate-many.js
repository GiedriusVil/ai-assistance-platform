/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-test-cases-service-test-executions-generate-many';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const ramda = require('@ibm-aca/aca-wrapper-ramda');
const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { formatIntoAcaError, throwAcaError, ACA_ERROR_TYPE } = require('@ibm-aca/aca-utils-errors');
const { saveMany } = require('./save-many');

const generateMany = async (context, params) => {
  try {
    const TEST_CASE_ID = ramda.path(['testCase', 'id'], params);
    const WORKER_IDS = ramda.path(['worker', 'ids'], params);
    const QUANTITY = ramda.path(['quantity'], params);
    if (
      lodash.isEmpty(TEST_CASE_ID)
    ) {
      const MESSAGE = `Missing required params.testCase.id parameter!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }
    if (
      lodash.isEmpty(WORKER_IDS)
    ) {
      const MESSAGE = `Missing required params.worker.ids parameter!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }
    if (
      !lodash.isArray(WORKER_IDS)
    ) {
      const MESSAGE = `Wrong params.worker.ids parameter type! [Array - required]`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }
    if (
      !lodash.isNumber(QUANTITY)
    ) {
      const MESSAGE = `Wrong params.quantity parameter type! [Number - required]`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }
    const EXECUTIONS = [];
    for (let index = 0; index < QUANTITY; index++) {
      const WORKER_INDEX = index % WORKER_IDS.length;
      const WORKER_ID = WORKER_IDS[WORKER_INDEX];
      EXECUTIONS.push({
        testCase: { id: TEST_CASE_ID },
        worker: { id: WORKER_ID },
        status: 'PENDING'
      });
    }
    const RET_VAL = await saveMany(context, { executions: EXECUTIONS });
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error('->', { ACA_ERROR });
    throw ACA_ERROR;
  }
};

module.exports = {
  generateMany,
}
