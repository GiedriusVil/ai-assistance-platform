/*
   © Copyright IBM Corporation 2022. All Rights Reserved 
    
   SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-json-rule-engine-almanac';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { formatIntoAcaError, throwAcaError, ACA_ERROR_TYPE } = require('@ibm-aca/aca-utils-errors');

const { Fact } = require('./fact');
const { UndefinedFactError } = require('./errors');

const { JSONPath } = require('@ibm-aca/aca-wrapper-jsonpath-plus');


function defaultPathResolver(json, path) {
  return JSONPath({ path, json, wrap: false })
}

/**
 * Fact results lookup
 * Triggers fact computations and saves the results
 * A new almanac is used for every engine run()
 */
class Almanac {

  constructor(factMap, runtimeFacts = {}, options = {}) {
    this.factMap = new Map(factMap);
    this.factResultsCache = new Map(); // { cacheKey:  Promise<factValu> }
    this.allowUndefinedFacts = Boolean(options.allowUndefinedFacts);
    this.pathResolver = options.pathResolver || defaultPathResolver;
    this.events = { success: [], failure: [] };
    this.ruleResults = [];
    for (const factId in runtimeFacts) {
      let fact;
      if (runtimeFacts[factId] instanceof Fact) {
        fact = runtimeFacts[factId];
      } else {
        fact = new Fact(factId, runtimeFacts[factId]);
      }
      this._addConstantFact(fact);
      // logger.info(`almanac::constructor initialized runtime fact:${fact.id} with ${fact.value}<${typeof fact.value}>`);
    }
  }

  /**
   * @param {string} type
   * @param {Object} event
   */
  addEvent(type, event) {
    if (
      lodash.isEmpty(type)
    ) {
      const ERROR_MESSAGE = `Missing required type parameter!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, ERROR_MESSAGE)
    }
    this.events[type].push(event);
  }

  /**
   * retrieve successful events
   */
  getEvents(outcome = '') {
    if (outcome) return this.events[outcome];
    return this.events.success.concat(this.events.failure);
  }

  /**
   * Adds a rule result
   * @param {Object} event
   */
  addResult(ruleResult) {
    this.ruleResults.push(ruleResult);
  }

  /**
   * retrieve successful events
   */
  getResults() {
    return this.ruleResults;
  }

  /**
   * Retrieve fact by id, raising an exception if it DNE
   * @param  {String} factId
   * @return {Fact}
   */
  _getFact(factId) {
    return this.factMap.get(factId);
  }

  /**
   * Registers fact with the almanac
   * @param {[type]} fact [description]
   */
  _addConstantFact(fact) {
    this.factMap.set(fact.id, fact);
    this._setFactValue(fact, {}, fact.value);
  }

  /**
   * Sets the computed value of a fact
   * @param {Fact} fact
   * @param {Object} params - values for differentiating this fact value from others, used for cache key
   * @param {Mixed} value - computed value
   */
  _setFactValue(fact, params, value) {
    const cacheKey = fact.getCacheKey(params);
    const factValue = Promise.resolve(value);
    if (cacheKey) {
      this.factResultsCache.set(cacheKey, factValue);
    }
    return factValue;
  }

  /**
   * Adds a constant fact during runtime.  Can be used mid-run() to add additional information
   * @param {String} fact - fact identifier
   * @param {Mixed} value - constant value of the fact
   */
  addRuntimeFact(factId, value) {
    // logger.info(`almanac::addRuntimeFact id:${factId}`);
    const fact = new Fact(factId, value);
    return this._addConstantFact(fact);
  }

  /**
   * Returns the value of a fact, based on the given parameters.  Utilizes the 'almanac' maintained
   * by the engine, which cache's fact computations based on parameters provided
   * @param  {string} factId - fact identifier
   * @param  {String} path - object
   * @param  {Object} params - parameters to feed into the fact.  By default, these will also be used to compute the cache key
   * @return {Promise} a promise which will resolve with the fact computation.
   */
  factValue(factId, path = '', params = {}) {
    let factValuePromise;
    const fact = this._getFact(factId);
    if (fact === undefined) {
      if (this.allowUndefinedFacts) {
        return Promise.resolve(undefined);
      } else {
        return Promise.reject(new UndefinedFactError(`Undefined fact: ${factId}`));
      }
    }
    if (fact.isConstant()) {
      factValuePromise = Promise.resolve(fact.calculate(params, this));
    } else {
      const cacheKey = fact.getCacheKey(params);
      const cacheVal = cacheKey && this.factResultsCache.get(cacheKey);
      if (cacheVal) {
        factValuePromise = Promise.resolve(cacheVal);
        // logger.info(`almanac::factValue cache hit for fact:${factId}`);
      } else {
        // logger.info(`almanac::factValue cache miss for fact:${factId}; calculating`);
        factValuePromise = this._setFactValue(fact, params, fact.calculate(params, this));
      }
    }
    if (path) {
      // logger.info(`condition::evaluate extracting object property ${path}`);
      return factValuePromise
        .then(factValue => {
          if (
            lodash.isObjectLike(factValue)
          ) {
            const pathValue = this.pathResolver(factValue, path);
            // logger.info(`condition::evaluate extracting object property ${path}, received: ${JSON.stringify(pathValue)}`);
            return pathValue
          } else {
            // logger.info(`condition::evaluate could not compute object path(${path}) of non-object: ${factValue} <${typeof factValue}>; continuing with ${factValue}`);
            return factValue;
          }
        });
    }
    return factValuePromise;
  }

  async factContext(fact, path, params) {
    let parts;
    let tmpPath;
    let retVal;
    try {
      if (
        lodash.isString(path)
      ) {
        parts = path.split('[*]');
        if (
          lodash.isArray(parts) &&
          parts.length > 1
        ) {
          parts.pop();
          tmpPath = parts.join('[*]');
          retVal = await this.factValue(fact, tmpPath, params);
        }
      }
      return retVal;
    } catch (error) {
      const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
      logger.error('factContext', { ACA_ERROR });
      throw ACA_ERROR;
    }
  }

}

module.exports = {
  Almanac,
};
