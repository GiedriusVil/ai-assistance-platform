/*
   © Copyright IBM Corporation 2022. All Rights Reserved 
    
   SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-json-rule-engine-rule-evaluation';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { throwAcaError, ACA_ERROR_TYPE } = require('@ibm-aca/aca-utils-errors');

class RuleEvaluation {

  /**
  *  @param {Object}   options
  *  @param {string}   options.id
  *  @param {Object}   options.rule
  *  @param {string}   options.rule.id
  *  @param {string}   options.rule.key
  *  @param {string}   options.rule.name
  *  @param {integer}  options.rule.priority
  *  @param {Object}   options.rule.event
  *  @param {string}   options.rule.event.type
  *  @param {Object}   options.rule.conditions
  *  @return {RuleEvaluation}
  */
  constructor(options) {
    if (
      lodash.isEmpty(options?.id)
    ) {
      const ERROR_MESSAGE = `Missing required options.id parameter!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, ERROR_MESSAGE);
    }
    if (
      lodash.isEmpty(options?.rule)
    ) {
      const ERROR_MESSAGE = `Missing required options.rule parameter!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, ERROR_MESSAGE);
    }
    this.id = lodash.cloneDeep(options?.id);
    this.rule = lodash.cloneDeep(options?.rule);
    this.evaluation = null;
  }

  /**
   * @param {Object} evaluation 
   * @param {boolean} evaluation.result 
   * @param {Array<{boolean, Object}>} evaluation.results - Array of { result, data }
  */
  setEvaluation(evaluation) {
    this.evaluation = evaluation;
  }

  /**
   * @param {boolean} stringify 
  */
  toJSON(stringify = true) {
    const PROPS = {
      id: this.id,
      rule: this.rule.toJSON(false),
      evaluation: this.evaluation,
    }
    let retVal = PROPS;
    if (stringify) {
      retVal = JSON.stringify(PROPS);
    }
    return retVal;
  }
}

module.exports = {
  RuleEvaluation,
};
