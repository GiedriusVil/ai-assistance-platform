/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-catalog-rules-engine-provider-rule-engine-json-rule-engine';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const ramda = require('@ibm-aca/aca-wrapper-ramda');
const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { formatIntoAcaError, throwAcaError, ACA_ERROR_TYPE } = require('@ibm-aca/aca-utils-errors');

const { Engine } = require('@ibm-aca/aca-json-rules-engine');
const { AcaCatalogRuleEngine } = require('../rule-engine');

const { getAcaCatalogRulesDatasourceByContext } = require('@ibm-aca/aca-catalog-rules-datasource-provider')
const { AIAP_EVENT_TYPE, getEventStreamByContext } = require('@ibm-aiap/aiap-event-stream-provider');

const { transformRulesToNativeFormat } = require('./transformer');

const {
  equalNonStrict,
  notEqualNonStrict,
  inWithJsonParse,
  notInWithJsonParse
} = require('./operators');

const _api = require('./api');

class AcaCatalogRuleEngineJsonRuleEngine extends AcaCatalogRuleEngine {

  constructor(config, context) {
    super();
    this.type = 'json-rule-engine';
    this.status = AcaCatalogRuleEngine.STATUS.OFFLINE;
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
    EVENT_STREAM.subscribe(AIAP_EVENT_TYPE.RESET_CATALOG_RULE_ENGINES, async (event) => {
      logger.info(`Received event from ${AIAP_EVENT_TYPE.RESET_CATALOG_RULE_ENGINES}`, { event });
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
      const DATASOURCE = getAcaCatalogRulesDatasourceByContext(this.context);
      if (
        lodash.isEmpty(DATASOURCE)
      ) {
        const MESSAGE = `Unable retrieve catalog rules datasource!`;
        throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, MESSAGE);
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
      for (const CATALOG_RULE of RULES) {
        const OTHER_QUERY = {
          filter: {
            ruleId: CATALOG_RULE.id,
          },
          pagination: {
            page: 1,
            size: 10000
          }
        }
        const CONDITIONS_RESPONSE = await DATASOURCE.rulesConditions.findManyByQuery(this.context, OTHER_QUERY);
        const CATALOGS_RESPONSE = await DATASOURCE.rulesCatalogs.findManyByQuery(this.context, OTHER_QUERY);

        CATALOG_RULE['conditions'] = ramda.pathOr([], ['items'], CONDITIONS_RESPONSE);
        CATALOG_RULE['catalogs'] = ramda.pathOr([], ['items'], CATALOGS_RESPONSE);
      }
      const RULES_NATIVE_FORMAT = transformRulesToNativeFormat(RULES);
      const RULES_NATIVE_FORMAT_KEYS = Object.keys(RULES_NATIVE_FORMAT);
      for (let key of RULES_NATIVE_FORMAT_KEYS) {
        let ruleNativeFormat = RULES_NATIVE_FORMAT[key];
        this._engine.addRule(ruleNativeFormat);
      }
      this.status = AcaCatalogRuleEngine.STATUS.ONLINE;
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
  AcaCatalogRuleEngineJsonRuleEngine,
}
