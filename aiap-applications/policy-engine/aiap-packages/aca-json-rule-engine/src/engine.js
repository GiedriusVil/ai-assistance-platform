/*
   © Copyright IBM Corporation 2022. All Rights Reserved 
    
   SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-json-rule-engine-engine';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { formatIntoAcaError, throwAcaError, ACA_ERROR_TYPE, appendDataToError } = require('@ibm-aca/aca-utils-errors');

const EventEmitter = require('eventemitter2');

const { Fact } = require('./fact');
const { Rule } = require('./rule');
const { Operator } = require('./operator');
const { OPERATORS } = require('./operators-default');
const { Almanac } = require('./almanac');

const READY = 'READY';
const RUNNING = 'RUNNING';
const FINISHED = 'FINISHED';

class Engine extends EventEmitter {
  /**
   * Returns a new Engine instance
   * @param  {Rule[]} rules - array of rules to initialize with
   */
  constructor(rules = [], options = {}) {
    super();
    this.rules = [];
    this.allowUndefinedFacts = options.allowUndefinedFacts || false;
    this.pathResolver = options.pathResolver;
    this.operators = new Map();
    this.facts = new Map();
    this.status = READY;
    rules.map(r => this.addRule(r));
    OPERATORS.map(o => this.addOperator(o));
  }

  /**
   * Add a rule definition to the engine
   * @param {object|Rule} properties - rule definition.  can be JSON representation, or instance of Rule
   * @param {integer} properties.priority (>1) - higher runs sooner.
   * @param {Object} properties.event - event to fire when rule evaluates as successful
   * @param {string} properties.event.type - name of event to emit
   * @param {string} properties.event.params - parameters to pass to the event listener
   * @param {Object} properties.conditions - conditions to evaluate when processing this rule
   */
  addRule(properties) {
    if (
      !properties
    ) {
      throw new Error('Engine: addRule() requires options');
    }
    let rule;
    if (properties instanceof Rule) {
      rule = properties;
    } else {
      if (
        !Object.prototype.hasOwnProperty.call(properties, 'event')
      ) {
        throw new Error('Engine: addRule() argument requires "event" property');
      }
      if (
        !Object.prototype.hasOwnProperty.call(properties, 'conditions')
      ) {
        throw new Error('Engine: addRule() argument requires "conditions" property');
      }
      rule = new Rule(properties);
    }
    rule.setEngine(this);
    this.rules.push(rule);
    this.prioritizedRules = null;
    return this;
  }

  /**
   * update a rule in the engine
   * @param {object|Rule} rule - rule definition. Must be a instance of Rule
   */
  updateRule(rule) {
    const ruleIndex = this.rules.findIndex(ruleInEngine => ruleInEngine.name === rule.name);
    if (ruleIndex > -1) {
      this.rules.splice(ruleIndex, 1);
      this.addRule(rule);
      this.prioritizedRules = null;
    } else {
      throw new Error('Engine: updateRule() rule not found');
    }
  }

  /**
   * Remove a rule from the engine
   * @param {object|Rule|string} rule - rule definition. Must be a instance of Rule
   */
  removeRule(rule) {
    let ruleRemoved = false;
    if (!(rule instanceof Rule)) {
      const filteredRules = this.rules.filter(ruleInEngine => ruleInEngine.name !== rule);
      ruleRemoved = filteredRules.length !== this.rules.length;
      this.rules = filteredRules;
    } else {
      const index = this.rules.indexOf(rule);
      if (index > -1) {
        ruleRemoved = Boolean(this.rules.splice(index, 1).length);
      }
    }
    if (ruleRemoved) {
      this.prioritizedRules = null;
    }
    return ruleRemoved;
  }

  /**
   * Add a custom operator definition
   * @param {string}   operatorOrName - operator identifier within the condition; i.e. instead of 'equals', 'greaterThan', etc
   * @param {function(factValue, jsonValue)} callback - the method to execute when the operator is encountered.
   */
  addOperator(operatorOrName, cb) {
    let operator;
    if (operatorOrName instanceof Operator) {
      operator = operatorOrName;
    } else {
      operator = new Operator(operatorOrName, cb);
    }
    // logger.info(`engine::addOperator name:${operator.name}`);
    this.operators.set(operator.name, operator);
  }

  /**
   * Remove a custom operator definition
   * @param {string}   operatorOrName - operator identifier within the condition; i.e. instead of 'equals', 'greaterThan', etc
   * @param {function(factValue, jsonValue)} callback - the method to execute when the operator is encountered.
   */
  removeOperator(operatorOrName) {
    let operatorName;
    if (operatorOrName instanceof Operator) {
      operatorName = operatorOrName.name;
    } else {
      operatorName = operatorOrName;
    }

    return this.operators.delete(operatorName);
  }

  /**
   * Add a fact definition to the engine.  Facts are called by rules as they are evaluated.
   * @param {object|Fact} id - fact identifier or instance of Fact
   * @param {function} definitionFunc - function to be called when computing the fact value for a given rule
   * @param {Object} options - options to initialize the fact with. used when "id" is not a Fact instance
   */
  addFact(id, valueOrMethod, options) {
    let factId = id;
    let fact;
    if (id instanceof Fact) {
      factId = id.id;
      fact = id;
    } else {
      fact = new Fact(id, valueOrMethod, options);
    }
    // logger.info(`engine::addFact id:${factId}`);
    this.facts.set(factId, fact);
    return this;
  }

  /**
   * Remove a fact definition to the engine.  Facts are called by rules as they are evaluated.
   * @param {object|Fact} id - fact identifier or instance of Fact
   */
  removeFact(factOrId) {
    let factId;
    if (!(factOrId instanceof Fact)) {
      factId = factOrId;
    } else {
      factId = factOrId.id;
    }

    return this.facts.delete(factId);
  }

  /**
   * Iterates over the engine rules, organizing them by highest -> lowest priority
   * @return {Rule[][]} two dimensional array of Rules.
   *    Each outer array element represents a single priority(integer).  Inner array is
   *    all rules with that priority.
   */
  prioritizeRules() {
    if (!this.prioritizedRules) {
      const ruleSets = this.rules.reduce((sets, rule) => {
        const priority = rule.priority;
        if (!sets[priority]) sets[priority] = [];
        sets[priority].push(rule);
        return sets;
      }, {})
      this.prioritizedRules = Object.keys(ruleSets).sort((a, b) => {
        return Number(a) > Number(b) ? -1 : 1; // order highest priority -> lowest
      }).map((priority) => ruleSets[priority]);
    }
    return this.prioritizedRules;
  }

  /**
   * Stops the rules engine from running the next priority set of Rules.  All remaining rules will be resolved as undefined,
   * and no further events emitted.  Since rules of the same priority are evaluated in parallel(not series), other rules of
   * the same priority may still emit events, even though the engine is in a "finished" state.
   * @return {Engine}
   */
  stop() {
    this.status = FINISHED;
    return this;
  }

  /**
   * Returns a fact by fact-id
   * @param  {string} factId - fact identifier
   * @return {Fact} fact instance, or undefined if no such fact exists
   */
  getFact(factId) {
    return this.facts.get(factId);
  }

  async _evaluateRule(almanac, rule) {
    try {
      if (
        this.status !== RUNNING
      ) {
        return;
      }
      const RULE_EVALUATION = await rule.evaluate(almanac);
      almanac.addResult(RULE_EVALUATION);
      const EVENT = {
        ...RULE_EVALUATION?.toJSON(false).rule?.event,
        conditions: RULE_EVALUATION?.rule?.conditions.toJSON(false),
      };
      const EVENT_TYPE = RULE_EVALUATION.evaluation?.result ? 'success' : 'failure';
      almanac.addEvent(EVENT_TYPE, EVENT);
      await this.emitAsync(
        EVENT_TYPE,
        {
          ...EVENT,
          almanac: almanac,
          evaluation: RULE_EVALUATION,
        }
      );
      await this.emitAsync(
        RULE_EVALUATION.rule.event.type,
        {
          ...EVENT,
          almanac: almanac,
          evaluation: RULE_EVALUATION,
        }
      );
    } catch (error) {
      const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
      logger.error('_evaluateRule', { ACA_ERROR });
      throw ACA_ERROR;
    }
  }

  /**
   * @param almanac 
   * @param rules 
   * @return RET_VAL
   */
  async _evaluateRules(almanac, rules) {
    try {
      const PROMISES = [];
      if (
        lodash.isArray(rules)
      ) {
        for (let rule of rules) {
          PROMISES.push(this._evaluateRule(almanac, rule));
        }
      }
      const RET_VAL = await Promise.all(PROMISES);
      return RET_VAL;
    } catch (error) {
      const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
      logger.error('_evaluateRules', { ACA_ERROR });
      throw ACA_ERROR;
    }
  }

  /**
  * Runs the rules engine
  * @param  {Object} runtimeFacts - fact values known at runtime
  * @param  {Object} runOptions - run options
  * @return {Object} RET_VAL
  */
  async run(facts = {}, options = {}) {
    try {
      if (
        lodash.isEmpty(facts)
      ) {
        const ERROR_MESSAGE = `Missing required facts parameter!`;
        throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, ERROR_MESSAGE);
      }
      this.status = RUNNING;
      const almanacOptions = {
        allowUndefinedFacts: this.allowUndefinedFacts,
        pathResolver: this.pathResolver,
      };
      const ALMANAC = new Almanac(this.facts, facts, almanacOptions);
      const RULES_PRIORITIZED = this.prioritizeRules();
      const PROMISES = [];
      for (let rules of RULES_PRIORITIZED) {
        PROMISES.push(this._evaluateRules(ALMANAC, rules));
      }
      await Promise.all(PROMISES);
      this.status = FINISHED;
      const RULES_EVALUATION = ALMANAC.getResults();
      const {
        results,
        failureResults,
      } = RULES_EVALUATION.reduce(
        (hash, ruleEvaluation) => {
          const group = ruleEvaluation?.evaluation?.result ? 'results' : 'failureResults';
          hash[group].push(ruleEvaluation.toJSON(false));
          return hash;
        },
        {
          results: [],
          failureResults: []
        }
      );
      const RET_VAL = {
        almanac: ALMANAC,
        results: results,
        failureResults: failureResults,
        events: ALMANAC.getEvents('success'),
        failureEvents: ALMANAC.getEvents('failure'),
      };
      return RET_VAL;
    } catch (error) {
      const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
      appendDataToError(ACA_ERROR, { options });
      logger.error('run', { ACA_ERROR });
      throw ACA_ERROR;
    }
  }

}



module.exports = {
  Engine,
  READY,
  RUNNING,
  FINISHED,
}
