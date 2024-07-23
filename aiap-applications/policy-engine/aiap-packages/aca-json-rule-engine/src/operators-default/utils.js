/*
   © Copyright IBM Corporation 2022. All Rights Reserved 
    
   SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = `aca-json-rule-engine-operators-default-utils`;
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { formatIntoAcaError, throwAcaError, ACA_ERROR_TYPE } = require('@ibm-aca/aca-utils-errors');


const numberValidator = (factValue) => {
  return Number.parseFloat(factValue).toString() !== 'NaN';
};

/**
* @param {Function} operator
* @param {Object} conditionValue 
* @param {Object} factValue 
* @param {Object} factContext 
* @returns {Object{result, results}}
*/
const executeOperator = (
  operator,
  conditionValue,
  factValue,
  factContext,
) => {
  let result;
  let results;
  try {
    if (
      lodash.isArray(factValue)
    ) {
      if (
        !lodash.isArray(factContext)
      ) {
        const ERROR_MESSAGE = `When factValue is Array -> factContext must be array also!`;
        throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, ERROR_MESSAGE);
      }
      if (
        factValue.length !== factContext.length
      ) {
        const ERROR_MESSAGE = `When factValue is Array -> factValue.length must be equal to factContext.length!`;
        throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, ERROR_MESSAGE);
      }
      results = [];
      for (let i = 0; i < factValue.length; i++) {
        let tmpResult = operator(factValue[i], conditionValue);
        results.push({
          result: tmpResult,
          data: factContext[i],
        })
      }
      result = results.some((item) => item.result === true);
    } else {
      result = operator(factValue, conditionValue);
    }
    const RET_VAL = { result, results };
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(executeOperator.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}



module.exports = {
  executeOperator,
  numberValidator,
}
