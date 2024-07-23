/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-lambda-modules-service-modules-calc-diff-by-value';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const lodash = require('@ibm-aca/aca-wrapper-lodash');
const { deepDifference } = require('@ibm-aca/aca-wrapper-obj-diff');

const { formatIntoAcaError, appendDataToError, throwAcaError, ACA_ERROR_TYPE } = require('@ibm-aca/aca-utils-errors');

const { findOneById } = require('./find-one-by-id');

const calcDiffByValue = async (context, params) => {
  const CONTEXT_USER_ID = context?.user?.id;
  let value;
  let valueId;
  let currentValue;
  try {
    value = params?.value;
    valueId = value?.id;
    if (
      lodash.isEmpty(value)
    ) {
      const MESSAGE = `Missing required params.value parameter!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }
    if (!lodash.isEmpty(valueId)) {
      currentValue = await findOneById(context, { id: valueId });
    }
    const RET_VAL = deepDifference(currentValue, value);
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, { CONTEXT_USER_ID });
    logger.error(`${calcDiffByValue.name}`, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

module.exports = {
  calcDiffByValue,
}
