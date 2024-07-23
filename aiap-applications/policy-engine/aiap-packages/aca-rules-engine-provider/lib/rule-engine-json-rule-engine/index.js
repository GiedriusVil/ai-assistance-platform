/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-rules-engine-json-rule-engine';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { formatIntoAcaError, throwAcaError, ACA_ERROR_TYPE } = require('@ibm-aca/aca-utils-errors');
const { retrieveOrganizationIdFromContext } = require('../utils');

const { Engine } = require('@ibm-aca/aca-json-rules-engine');


const { getAcaRulesDatasourceByContext } = require('@ibm-aca/aca-rules-datasource-provider');

const {
  AIAP_EVENT_TYPE,
  getEventStreamByContext,
} = require('@ibm-aiap/aiap-event-stream-provider');

const { AcaRuleEngine } = require('../rule-engine');

const {
  rulesToNativeFormat,
} = require('./transformer');

const {
  FactGroupByCategory,
  FactGroupBySeller,
  FactGroupByItemFields,
} = require('./facts');

const {
  OPERATORS,
} = require('./operators');

const _requisition = require('./requisition');

class AcaRuleEngineJsonRuleEngine extends AcaRuleEngine {

  constructor(config, context) {
    super();
    this.type = 'json-rule-engine';
    this.status = AcaRuleEngine.STATUS.OFFLINE;
    try {
      if (
        lodash.isEmpty(config)
      ) {
        const MESSAGE = 'Missing required config parameter!';
        throwAcaError(MODULE_ID, ACA_ERROR_TYPE.INITIALIZATION_ERROR, MESSAGE);
      }
      if (
        lodash.isEmpty(context)
      ) {
        const MESSAGE = ' Missing required context parameter!';
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
    EVENT_STREAM.subscribe(AIAP_EVENT_TYPE.RESET_ENGINES, async (event) => {
      logger.info(`Received event from ${AIAP_EVENT_TYPE.RESET_ENGINES}`, { event });
      this.initialize();
    });
  }

  _addCustomFacts() {
    this._engine.addFact(FactGroupByCategory.NAME, FactGroupByCategory.addFactToAlmanac);
    this._engine.addFact(FactGroupBySeller.NAME, FactGroupBySeller.addFactToAlmanac);
    this._engine.addFact(FactGroupByItemFields.NAME, FactGroupByItemFields.addFactToAlmanac);
  }

  _addCustomOperators() {
    if (
      !lodash.isEmpty(OPERATORS) &&
      lodash.isArray(OPERATORS)
    ) {
      for (let operator of OPERATORS) {
        this._engine.addOperator(operator);
      }
    }
  }

  async initialize() {
    try {
      this._engine = new Engine([], this.config);
      this._addCustomFacts();
      this._addCustomOperators();
      const DATASOURCE = getAcaRulesDatasourceByContext(this.context);
      if (
        lodash.isEmpty(DATASOURCE)
      ) {
        const MESSAGE = 'Unable to retrieve rules datasource!';
        throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, MESSAGE);
      }
      const ORGANIZATION_ID = retrieveOrganizationIdFromContext(this.context);
      const RULES_QUERY = {
        filter:
        {
          buyerIds: [ORGANIZATION_ID],
          status: {
            enabled: true
          }
        },
        pagination: {
          page: 1,
          size: 10000
        }
      }
      const RESPONSE = await DATASOURCE.rules.findManyByQuery(this.context, RULES_QUERY);
      const RULES = RESPONSE?.items || [];
      const RULES_NATIVE_FORMAT = rulesToNativeFormat(RULES);
      const RULES_NATIVE_FORMAT_KEYS = Object.keys(RULES_NATIVE_FORMAT);
      for (let key of RULES_NATIVE_FORMAT_KEYS) {
        let ruleNativeFormat = RULES_NATIVE_FORMAT[key];
        this._engine.addRule(ruleNativeFormat);
      }
      this.status = AcaRuleEngine.STATUS.ONLINE;
      logger.info(`[${MODULE_ID}] INITIALIZED engine for organization - '${ORGANIZATION_ID}'`);
    } catch (error) {
      const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
      logger.error('initialize', { ACA_ERROR });
      throw ACA_ERROR;
    }
  }

  get requisition() {
    const RET_VAL = {
      validateOne: (context, params) => {
        return _requisition.validateOne(this._engine, context, params);
      },
    };
    return RET_VAL;
  }

}

module.exports = {
  AcaRuleEngineJsonRuleEngine
}
