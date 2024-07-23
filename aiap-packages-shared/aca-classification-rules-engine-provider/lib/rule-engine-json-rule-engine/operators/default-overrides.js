/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-classification-rules-engine-provider-json-rule-engine-operator-default-overrides';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const lodash = require('@ibm-aca/aca-wrapper-lodash');
const { createAcaError, ACA_ERROR_TYPE, throwAcaError } = require('@ibm-aca/aca-utils-errors');

const { Operator } = require('@ibm-aca/aca-json-rules-engine');

const equalNonStrict = new Operator('equal', (a, b) => a == b)
const notEqualNonStrict = new Operator('notEqual', (a, b) => a != b)

const inWithJsonParse = new Operator('in', (actual, expected) => {
  try {
    expected = JSON.parse(expected)
  } catch (error) {
    const MESSAGE = `Unable to parse expected value!`;
    const ACA_ERROR = createAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, MESSAGE, { error });
    logger.error(`${inWithJsonParse.name}`, { ACA_ERROR });
  }
  if (
    !lodash.isArray(expected)
  ) {
    const MESSAGE = `Wrong type of expected value! Has to be array of format ["XXXX", "YYY", ..., "ZZZZ"]`;
    throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE, { expected });
  }
  return expected.indexOf(actual) > -1
})

const notInWithJsonParse = new Operator('notIn', (actual, expected) => {
  try {
    expected = JSON.parse(expected)
  } catch (error) {
    const MESSAGE = `Unable to parse expected value!`;
    const ACA_ERROR = createAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, MESSAGE, { error });
    logger.error(`${notInWithJsonParse.name}`, { ACA_ERROR });
  }
  if (!lodash.isArray(expected)) {
    const MESSAGE = `Wrong type of expected value! Has to be array of format ["XXXX", "YYY", ..., "ZZZZ"]`;
    throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE, { expected });
  }
  return expected.indexOf(actual) === -1
})

module.exports = {
  equalNonStrict,
  notEqualNonStrict,
  inWithJsonParse,
  notInWithJsonParse
}
