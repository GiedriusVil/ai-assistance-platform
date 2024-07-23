/*
   © Copyright IBM Corporation 2022. All Rights Reserved 
    
   SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-json-rule-engine-operator';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const lodash = require('@ibm-aca/aca-wrapper-lodash');
const { throwAcaError, ACA_ERROR_TYPE, formatIntoAcaError } = require('@ibm-aca/aca-utils-errors');

class Operator {

  /**
   * @param {string} name - operator identifier
   * @param {function(factValue, jsonValue)} validator - operator evaluation method
   * @returns {Operator} - instance
   */
  constructor(name, validator) {
    try {
      if (
        lodash.isEmpty(name)
      ) {
        const ERROR_MESSAGE = `Missing required name parameter!`;
        throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, ERROR_MESSAGE);
      }

      if (
        !lodash.isFunction(validator)
      ) {
        const ERROR_MESSAGE = `Wrong type of required validator parameter! Function expected!`;
        throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, ERROR_MESSAGE);
      }
      this.name = String(name);
      this.validator = validator;
    } catch (error) {
      const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
      logger.error('constructor', { ACA_ERROR });
      throw ACA_ERROR;
    }
  }

  /**
   * Takes the fact result and compares it to the condition 'value', using the callback
   * @param {Object} context -
   * @param {Object} params - 
   * @returns {Object} -
   */
  async evaluate(context, params) {
    const RET_VAL = await this.validator(context, params);
    return RET_VAL;
  }

}

module.exports = {
  Operator,
};
