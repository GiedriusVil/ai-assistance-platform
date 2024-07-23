/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-test-cases-service-test-executions-save-many';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const ramda = require('@ibm-aca/aca-wrapper-ramda');
const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { formatIntoAcaError, throwAcaError, ACA_ERROR_TYPE } = require('@ibm-aca/aca-utils-errors');
const { saveOne } = require('./save-one');

const saveMany = async (context, params) => {
  try {
    const EXECUTIONS = ramda.path(['executions'], params);
    if (
      lodash.isEmpty(EXECUTIONS)
    ) {
      const MESSAGE = `Missing required params.executions parameter!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }
    if (
      !lodash.isArray(EXECUTIONS)
    ) {
      const MESSAGE = `Wrong params.execeutions parameter type! [Array - required]`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }
    const PROMISES = [];
    for (let execution of EXECUTIONS) {
      PROMISES.push(saveOne(context, { execution }));
    }
    const RET_VAL = await Promise.all(PROMISES);
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(`${saveMany.name}`, { ACA_ERROR });
    throw ACA_ERROR;
  }
};

module.exports = {
  saveMany,
}
