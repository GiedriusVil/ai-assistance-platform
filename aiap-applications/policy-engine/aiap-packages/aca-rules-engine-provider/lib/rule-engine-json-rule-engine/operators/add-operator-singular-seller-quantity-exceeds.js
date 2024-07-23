/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-rules-engine-provider-json-rule-engine-operators-add-operator-singular-seller-quantity-exceeds';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { formatIntoAcaError, throwAcaError, ACA_ERROR_TYPE } = require('@ibm-aca/aca-utils-errors');

const { Operator } = require('@ibm-aca/aca-json-rules-engine');

const { executeOperator } = require('./utils');

const _operator = (factValue, conditionValue) => {
  try {
    let retVal = false;
    if (
      !lodash.isEmpty(factValue)
    ) {
      const SELLERS = factValue.filter(seller => seller.totalQuantity > conditionValue);
      retVal = !lodash.isEmpty(SELLERS);
    }
    return retVal;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.info(_operator.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

const VALIDATOR = async (context, params) => {
  let almanac;
  let condition;
  let conditionValue;
  let factValue;
  let factContext;
  let result;
  let results;
  try {
    almanac = context?.almanac;
    condition = params?.condition;
    if (
      lodash.isEmpty(almanac)
    ) {
      const ERROR_MESSAGE = `Missing required context.almanac attribute!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, ERROR_MESSAGE);
    }
    if (
      lodash.isEmpty(condition)
    ) {
      const ERROR_MESSAGE = `Missing required params.condition attribute!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, ERROR_MESSAGE);
    }
    conditionValue = await condition._getValue(almanac);
    factValue = await almanac.factValue(condition.fact, condition.path, condition.params);
    factContext = await almanac.factContext(condition.fact, condition.path, condition.params);

    const EXECUTION = await executeOperator(_operator, conditionValue, factValue, factContext);
    result = EXECUTION?.result;
    results = EXECUTION?.results;

    const RET_VAL = { conditionValue, factValue, result };
    if (
      results
    ) {
      RET_VAL.results = results;
    }
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(VALIDATOR.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

const addOperatorSingularSellerQuantityExceeds = (operators) => {
  operators.push(new Operator('singularSellerQuantityExceeds', VALIDATOR));
}

module.exports = {
  addOperatorSingularSellerQuantityExceeds,
}
