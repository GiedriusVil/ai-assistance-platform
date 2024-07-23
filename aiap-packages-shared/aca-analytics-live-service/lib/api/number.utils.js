/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-analytics-live-service-number-utils';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { formatIntoAcaError } = require('@ibm-aca/aca-utils-errors');

//Can round an array of numbers or an array of objects
//If an array of objects is provided, the path must also be provided
//Path is an array of object keys (as strings) that lead to the number (like in ramda)
const roundNumbersInArray = (array, digitsAfterDecimal = 1, path = undefined) => {
  try {
    if (lodash.isEmpty(path)) {
      const ROUNDED_ARRAY = [];
      array.map((number) => {
        ROUNDED_ARRAY.push(roundNumber(number, digitsAfterDecimal));
      });
      return ROUNDED_ARRAY;
    } else {
      array.map((object) => {
        roundNumberInObject(object, digitsAfterDecimal, path);
      });
    }
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.warn('roundNumbersInArray', { ACA_ERROR, array });
  }
}

const roundNumberInObject = (object, digitsAfterDecimal = 1, path) => {
  try {
    if (!lodash.isEmpty(path)) {
      if (path.length > 1) {
        const NEW_PATH = lodash.cloneDeep(path);
        const KEY = NEW_PATH.shift();
        roundNumberInObject(object[KEY], digitsAfterDecimal, NEW_PATH);
      } else {
        const KEY = path[0];
        object[KEY] = roundNumber(object[KEY], digitsAfterDecimal);
      }
    }
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.warn('roundNumberInObject', { ACA_ERROR, object });
  }
}

const roundNumber = (number, digitsAfterDecimal = 1) => {
  if (
    lodash.isNumber(number) &&
    lodash.isInteger(digitsAfterDecimal)
  ) {
    return lodash.round(number, digitsAfterDecimal);
  }
  return number;
}

module.exports = {
  roundNumbersInArray,
  roundNumberInObject,
  roundNumber,
}
