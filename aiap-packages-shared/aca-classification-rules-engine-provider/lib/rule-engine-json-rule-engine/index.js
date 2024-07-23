/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-classification-rules-engine-json-rule-engine';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const ramda = require('@ibm-aca/aca-wrapper-ramda');
const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { formatIntoAcaError, throwAcaError, ACA_ERROR_TYPE } = require('@ibm-aca/aca-utils-errors');

const { Engine } = require('@ibm-aca/aca-json-rules-engine');
const { AcaClassificationRuleEngine } = require('../rule-engine');

const { getAcaClassificationRulesDatasourceByContext } = require('@ibm-aca/aca-classification-rules-datasource-provider')
const {
  AIAP_EVENT_TYPE,
  getEventStreamByContext,
} = require('@ibm-aiap/aiap-event-stream-provider');

const {
  transformClassificationRulesToNativeFormat,
} = require('./transformer');

const {
  equalNonStrict,
  notEqualNonStrict,
  inWithJsonParse,
  notInWithJsonParse
} = require('./operators');

const _api = require('./api');

class AcaClassificationRuleEngineJsonRuleEngine extends AcaClassificationRuleEngine {

  constructor(config, context) {
    super();
    this.type = 'json-rule-engine';
    this.status = AcaClassificationRuleEngine.STATUS.OFFLINE;
    try {
      if (
        lodash.isEmpty(config)
      ) {
        const MESSAGE = `Missing required config parameter!`;
        throwAcaError(MODULE_ID, ACA_ERROR_TYPE.INITIALIZATION_ERROR, MESSAGE);
      }
      if (
        lodash.isEmpty(context)
      ) {
        const MESSAGE = `Missing required context parameter!`;
        throwAcaError(MODULE_ID, ACA_ERROR_TYPE.INITIALIZATION_ERROR, MESSAGE);
      }
      this.config = config;
      this.context = context;
      this._subscribeToEvents(context);
    } catch (error) {
      const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
      logger.error('constructor', ACA_ERROR);
      throw ACA_ERROR;
    }
  }

  _subscribeToEvents(context) {
    const EVENT_STREAM = getEventStreamByContext(context);
    EVENT_STREAM.subscribe(AIAP_EVENT_TYPE.RESET_CLASSIFICATION_RULE_ENGINES, async (event) => {
      logger.info(`Received event from ${AIAP_EVENT_TYPE.RESET_CLASSIFICATION_RULE_ENGINES}`, { event });
      this.initialize();
    });
  }

  _addCustomOperators() {
    // Default (not)equal operators use strict comparison this means that we would need to know what type of value (number, string, etc) user is trying to input
    this._engine.addOperator(equalNonStrict);
    this._engine.addOperator(notEqualNonStrict);
    // Default (not)in operators work on both strings and arrays, by default we are always passing a string, this causes issues: "[111]".indexOf("11") > -1 => true
    this._engine.addOperator(inWithJsonParse);
    this._engine.addOperator(notInWithJsonParse);
  }

  async initialize() {
    try {
      this._engine = new Engine([], this.config);
      this._addCustomOperators();
      const DATASOURCE = getAcaClassificationRulesDatasourceByContext(this.context);
      if (
        lodash.isEmpty(DATASOURCE)
      ) {
        const ACA_ERROR = {
          type: 'SYSTEM_ERROR',
          message: `[${MODULE_ID}] Unable to retrieve classification rules datasource!`,
          context: this.context
        };
        throw ACA_ERROR;
      }

      // TODO:
      // Add date filters to only include effective, notexpired rules
      // Would need to reinitialize engine every day
      // Recreate engine when new rule is added
      const RULES_QUERY = {
        pagination: {
          page: 1,
          size: 10000
        }
      }

      const RESPONSE = await DATASOURCE.rules.findManyByQuery(this.context, RULES_QUERY);
      const RULES = ramda.pathOr([], ['items'], RESPONSE);
      for (const CLASSIFICATION_RULE of RULES) {
        const CLASSIFICATION_DATA_QUERY = {
          filter: {
            ruleId: CLASSIFICATION_RULE.id,
          },
          pagination: {
            page: 1,
            size: 10000
          }
        }
        const CONDITIONS_RESPONSE = await DATASOURCE.rulesConditions.findManyByQuery(this.context, CLASSIFICATION_DATA_QUERY);
        const CLASSIFICATIONS_RESPONSE = await DATASOURCE.rulesClassifications.findManyByQuery(this.context, CLASSIFICATION_DATA_QUERY);
        CLASSIFICATION_RULE.conditions = ramda.pathOr([], ['items'], CONDITIONS_RESPONSE);
        CLASSIFICATION_RULE.classifications = ramda.pathOr([], ['items'], CLASSIFICATIONS_RESPONSE);
      }
      const RULES_NATIVE_FORMAT = transformClassificationRulesToNativeFormat(RULES);
      const RULES_NATIVE_FORMAT_KEYS = Object.keys(RULES_NATIVE_FORMAT);
      for (let key of RULES_NATIVE_FORMAT_KEYS) {
        let ruleNativeFormat = RULES_NATIVE_FORMAT[key];
        this._engine.addRule(ruleNativeFormat);
      }
      this.status = AcaClassificationRuleEngine.STATUS.ONLINE;
      logger.info(`INITIALIZED`);
    } catch (error) {
      const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
      logger.error(`initialize`, { ACA_ERROR });
      throw ACA_ERROR;
    }
  }

  get api() {
    const RET_VAL = {
      validateOne: (context, params) => {
        return _api.validateOne(this._engine, context, params);
      },
    };
    return RET_VAL;
  }

}

module.exports = {
  AcaClassificationRuleEngineJsonRuleEngine
}
