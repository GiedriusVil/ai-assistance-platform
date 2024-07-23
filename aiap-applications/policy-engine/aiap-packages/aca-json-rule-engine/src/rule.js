/*
   © Copyright IBM Corporation 2022. All Rights Reserved 
    
   SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-json-rule-engine-rule';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { uuidv4 } = require('@ibm-aca/aca-wrapper-uuid');

const { formatIntoAcaError, throwAcaError, ACA_ERROR_TYPE } = require('@ibm-aca/aca-utils-errors');

const EventEmitter = require('eventemitter2');

const { Condition } = require('./condition');
const { RuleEvaluation } = require('./rule-evaluation');

class Rule extends EventEmitter {

  /**
   * @param  {Object}    options
   * @param  {string}    options.id
   * @param  {string}    options.key
   * @param  {string}    options.name
   * @param  {integer}   options.priority 
   * @param  {Object}    options.conditions
   * @param  {Function}  options.onSuccess
   * @param  {Function}  options.onFailure
   * @param  {Object}    options.event
   * @param  {string}    options.event.type
   * @return {Rule}
   */
  constructor(options) {
    super()
    if (
      typeof options === 'string'
    ) {
      options = JSON.parse(options);
    }
    if (
      lodash.isEmpty(options?.id)
    ) {
      const ERROR_MESSAGE = `Missing required options.id parameter!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, ERROR_MESSAGE);
    }
    this.setId(options?.id);
    this.setKey(options?.key);
    this.setName(options?.name);
    const priority = (options?.priority) || 1;
    this.setPriority(priority);
    this.setConditions(options?.conditions);
    if (
      lodash.isFunction(options?.onSuccess)
    ) {
      this.on('success', options.onSuccess);
    }
    if (
      lodash.isFunction(options?.onFailure)
    ) {
      this.on('failure', options.onFailure);
    }
    const event = (options?.event) || { type: 'unknown' };
    this.setEvent(event);
  }

  /**
  * @param {string} id
  */
  setId(id) {
    if (
      lodash.isEmpty(id)
    ) {
      const ERROR_MESSAGE = `Missing required id parameter!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, ERROR_MESSAGE);
    }
    this.id = id;
    return this;
  }

  /**
  * @param {string} key
  */
  setKey(key) {
    if (
      lodash.isEmpty(key)
    ) {
      const ERROR_MESSAGE = `Missing required key parameter!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, ERROR_MESSAGE);
    }
    this.key = key;
    return this;
  }

  /**
  * @param {string} name
  */
  setName(name) {
    if (
      lodash.isEmpty(name)
    ) {
      const ERROR_MESSAGE = `Missing required name parameter!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, ERROR_MESSAGE);
    }
    this.name = name;
    return this;
  }

  /**
   * @param {integer} priority (>=1) - increasing the priority causes the rule to be run prior to other rules
   */
  setPriority(priority) {
    priority = parseInt(priority, 10);
    if (priority <= 0) throw new Error('Priority must be greater than zero');
    this.priority = priority;
    return this;
  }

  /**
   * @param {Object} conditions
   */
  setConditions(conditions) {
    if (
      conditions
    ) {
      if (
        !Object.prototype.hasOwnProperty.call(conditions, 'all') &&
        !Object.prototype.hasOwnProperty.call(conditions, 'any')
      ) {
        const ERROR_MESSAGE = `Missing single conditions.[all || any] instance`;
        throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, ERROR_MESSAGE);
      }
      this.conditions = new Condition(conditions);
    }
    return this;
  }

  /**
   * @param {Object} event
   * @param {string} event.type
   */
  setEvent(event) {
    if (!event) throw new Error('Rule: setEvent() requires event object');
    if (!Object.prototype.hasOwnProperty.call(event, 'type')) throw new Error('Rule: setEvent() requires event object with "type" property');
    this.ruleEvent = {
      ...event,
    };
    return this;
  }

  /**
   * returns the event object
   * @returns {Object} event
   */
  getEvent() {
    return this.ruleEvent;
  }

  /**
   * returns the priority
   * @returns {Number} priority
   */
  getPriority() {
    return this.priority;
  }

  /**
   * returns the event object
   * @returns {Object} event
   */
  getConditions() {
    return this.conditions;
  }

  /**
   * returns the engine object
   * @returns {Object} engine
   */
  getEngine() {
    return this.engine;
  }

  /**
   * Sets the engine to run the rules under
   * @param {object} engine
   * @returns {Rule}
   */
  setEngine(engine) {
    this.engine = engine;
    return this;
  }

  toJSON(stringify = true) {
    const props = {
      id: this.id,
      key: this.key,
      name: this.name,
      priority: this.priority,
      conditions: this.conditions.toJSON(false),
      event: this.ruleEvent,
    }
    if (stringify) {
      return JSON.stringify(props);
    }
    return props;
  }

  /**
   * Priorizes an array of conditions based on "priority"
   *   When no explicit priority is provided on the condition itself, the condition's priority is determine by its fact
   * @param  {Condition[]} conditions
   * @return {Condition[][]} prioritized two-dimensional array of conditions
   *    Each outer array element represents a single priority(integer).  Inner array is
   *    all conditions with that priority.
   */
  prioritizeConditions(conditions) {
    const factSets = conditions.reduce((sets, condition) => {
      // if a priority has been set on this specific condition, honor that first
      // otherwise, use the fact's priority
      let priority = condition.priority;
      if (!priority) {
        const fact = this.engine.getFact(condition.fact);
        priority = (fact && fact.priority) || 1;
      }
      if (!sets[priority]) sets[priority] = [];
      sets[priority].push(condition);
      return sets;
    }, {});
    return Object.keys(factSets).sort((a, b) => {
      return Number(a) > Number(b) ? -1 : 1; // order highest priority -> lowest
    }).map((priority) => factSets[priority]);
  }



  /**
   * Evaluates the rule, starting with the root boolean operator and recursing down
   * All evaluation is done within the context of an almanac
   * @return {Promise(RuleResult)} rule evaluation result
   */
  async evaluate(almanac) {
    const RULE_EVALUATION = new RuleEvaluation({
      id: uuidv4(),
      rule: this,
    });

    const any = async (conditions) => {
      const RET_VAL = await prioritizeAndRun(conditions, 'any');
      return RET_VAL;
    }

    const all = async (conditions) => {
      const RET_VAL = await prioritizeAndRun(conditions, 'all');
      return RET_VAL;
    }

    const prioritizeAndRun = async (conditions, operator) => {
      try {
        if (
          lodash.isEmpty(conditions)
        ) {
          return true;
        }
        let method = Array.prototype.some;
        if (
          operator === 'all'
        ) {
          method = Array.prototype.every;
        }
        const CONDITIONS_PRIORITIZED = this.prioritizeConditions(conditions);
        const PROMISES = [];
        for (let conditions of CONDITIONS_PRIORITIZED) {
          PROMISES.push(evaluateConditions(conditions, method));
        }
        const CONDITIONS_EVALUATION = await Promise.all(PROMISES);

        const RET_VAL = {};

        RET_VAL.result = method.call(CONDITIONS_EVALUATION, (evalulation) => evalulation?.result === true);

        return RET_VAL;
      } catch (error) {
        const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
        logger.error(prioritizeAndRun.name, { ACA_ERROR });
        throw ACA_ERROR;
      }
    };

    const evaluateCondition = async (condition) => {
      const RET_VAL = {};
      try {
        if (
          condition.isBooleanOperator()
        ) {
          const SUB_CONDITIONS = condition[condition.operator];
          let evaluation;
          if (
            condition.operator === 'all'
          ) {
            evaluation = await all(SUB_CONDITIONS);
          } else {
            evaluation = await any(SUB_CONDITIONS);
          }
          condition.evaluation = {
            operator: condition.operator,
            result: evaluation?.result,
          }
        } else {
          await condition.evaluate(almanac, this.engine.operators);
        }
        RET_VAL.result = condition.evaluation.result;
        return RET_VAL;
      } catch (error) {
        const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
        logger.error(evaluateConditions.name, { ACA_ERROR });
        throw ACA_ERROR;
      }
    };

    const evaluateConditions = async (conditions, method) => {
      const RET_VAL = {};
      let tmpConditions;
      try {
        tmpConditions = conditions;
        if (
          !lodash.isArray(tmpConditions)
        ) {
          tmpConditions = [tmpConditions];
        }
        const PROMISES = [];
        for (let condition of tmpConditions) {
          PROMISES.push(evaluateCondition(condition));
        }
        const CONDITIONS_EVALUATION = await Promise.all(PROMISES);

        const RESULT = method.call(
          CONDITIONS_EVALUATION,
          (evaluation) => evaluation?.result === true
        );
        RET_VAL.result = RESULT;
        return RET_VAL;
      } catch (error) {
        const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
        logger.error(evaluateConditions.name, { ACA_ERROR });
        throw ACA_ERROR;
      }
    };

    /**
     * @param {RuleResult} evaluation
     */
    const processEvaluation = async (evaluation) => {
      try {
        RULE_EVALUATION.setEvaluation(evaluation);
        const EVENT = evaluation?.result ? 'success' : 'failure';
        await this.emitAsync(EVENT, {
          almanac: almanac,
          evaluation: RULE_EVALUATION,
        });
        return RULE_EVALUATION;
      } catch (error) {
        const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
        logger.error(processEvaluation.name, { ACA_ERROR });
        throw ACA_ERROR;
      }
    }

    let evaluation;
    if (
      RULE_EVALUATION.rule.conditions.any
    ) {
      evaluation = await any(RULE_EVALUATION.rule.conditions.any);
    } else {
      evaluation = await all(RULE_EVALUATION.rule.conditions.all);
    }
    const RET_VAL = await processEvaluation(evaluation);
    return RET_VAL;
  }
}

module.exports = {
  Rule,
};
