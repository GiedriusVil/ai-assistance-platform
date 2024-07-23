/*
   © Copyright IBM Corporation 2022. All Rights Reserved 
    
   SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-json-rule-engine-condition';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const { throwAcaError, ACA_ERROR_TYPE } = require('@ibm-aca/aca-utils-errors');
const lodash = require('@ibm-aca/aca-wrapper-lodash');

class Condition {

  constructor(properties) {
    if (
      !properties
    ) {
      throw new Error('Condition: constructor options required');
    }
    const booleanOperator = Condition.booleanOperator(properties);
    Object.assign(this, properties);
    if (
      booleanOperator
    ) {
      const subConditions = properties[booleanOperator];
      if (
        !lodash.isArray(subConditions)
      ) {
        const ERROR_MESSAGE = `Wrong type of booleanOperator, must be an array!`;
        throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, ERROR_MESSAGE);
      }
      this.operator = booleanOperator;
      // boolean conditions always have a priority; default 1
      this.priority = parseInt(properties.priority, 10) || 1;
      this[booleanOperator] = subConditions.map((c) => {
        return new Condition(c);
      });
    } else {
      if (!Object.prototype.hasOwnProperty.call(properties, 'fact')) throw new Error('Condition: constructor "fact" property required');
      if (!Object.prototype.hasOwnProperty.call(properties, 'operator')) throw new Error('Condition: constructor "operator" property required');
      if (!Object.prototype.hasOwnProperty.call(properties, 'value')) throw new Error('Condition: constructor "value" property required');

      // a non-boolean condition does not have a priority by default. this allows
      // priority to be dictated by the fact definition
      if (
        Object.prototype.hasOwnProperty.call(properties, 'priority')
      ) {
        properties.priority = parseInt(properties.priority, 10);
      }
    }
  }

  /**
   * Converts the condition into a json-friendly structure
   * @param   {Boolean} stringify - whether to return as a json string
   * @returns {string,object} json string or json-friendly object
   */
  toJSON(stringify = true) {
    const props = {};
    if (this.priority) {
      props.priority = this.priority;
    }
    const oper = Condition.booleanOperator(this);
    if (oper) {
      props[oper] = this[oper].map((c) => c.toJSON(stringify));
    } else {
      props.id = this.id;
      props.operator = this.operator;
      props.value = this.value;
      props.fact = this.fact;
      if (
        this.factValue
      ) {
        props.factValue = this.factValue;
      }
      if (
        this.result
      ) {
        props.result = this.result;
      }
      if (
        this.results
      ) {
        props.results = this.results;
      }
      if (
        this.params
      ) {
        props.params = this.params;
      }
      if (
        this.path
      ) {
        props.path = this.path;
      }
      if (
        this.evaluation
      ) {
        props.evaluation = this.evaluation;
      }
    }
    if (stringify) {
      return JSON.stringify(props);
    }
    return props;
  }

  /**
   * Interprets .value as either a primitive, or if a fact, retrieves the fact value
   */
  async _getValue(almanac) {
    let value = this.value;
    if (
      lodash.isObjectLike(value) &&
      Object.prototype.hasOwnProperty.call(value, 'fact')
    ) {
      value = await almanac.factValue(value.fact, value.path, value.params);
    }
    return value;
  }



  /**
   * Takes the fact result and compares it to the condition 'value', using the operator
   *   LHS                      OPER       RHS
   * <fact + params + path>  <operator>  <value>
   *
   * @param   {Almanac} almanac
   * @param   {Map} operatorMap - map of available operators, keyed by operator name
   * @returns {Boolean} - evaluation result
   */
  async evaluate(almanac, operators) {
    if (
      !almanac
    ) {
      const ERROR_MESSAGE = `Missing required almanac parameter!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, ERROR_MESSAGE);
    }
    if (
      !operators
    ) {
      const ERROR_MESSAGE = `Missing required operators parameter!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, ERROR_MESSAGE);
    }
    if (
      this.isBooleanOperator()
    ) {
      const ERROR_MESSAGE = `Cannot evaluate() a boolean condition!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, ERROR_MESSAGE);
    }
    const OPERATOR = operators.get(this.operator);
    if (
      !OPERATOR
    ) {
      const ERROR_MESSAGE = `Unknown operator: ${this.operator}!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, ERROR_MESSAGE);
    }
    const CONTEXT = { almanac };
    const PARAMS = { condition: this };
    const EVALUATION = await OPERATOR.evaluate(CONTEXT, PARAMS);

    this.evaluation = {
      operator: this.operator,
      factValue: EVALUATION.factValue,
      result: EVALUATION?.result,
      results: EVALUATION?.results,
    }
    const RET_VAL = this.evaluation;
    return RET_VAL;
  }

  /**
   * Returns the boolean operator for the condition
   * If the condition is not a boolean condition, the result will be 'undefined'
   * @return {string 'all' or 'any'}
   */
  static booleanOperator(condition) {
    if (Object.prototype.hasOwnProperty.call(condition, 'any')) {
      return 'any';
    } else if (Object.prototype.hasOwnProperty.call(condition, 'all')) {
      return 'all';
    }
  }

  /**
   * Returns the condition's boolean operator
   * Instance version of Condition.isBooleanOperator
   * @returns {string,undefined} - 'any', 'all', or undefined (if not a boolean condition)
   */
  booleanOperator() {
    return Condition.booleanOperator(this);
  }

  /**
   * Whether the operator is boolean ('all', 'any')
   * @returns {Boolean}
   */
  isBooleanOperator() {
    return Condition.booleanOperator(this) !== undefined;
  }
}

module.exports = {
  Condition,
};
