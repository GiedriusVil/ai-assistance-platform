/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-rules-engine-provider-v2-rule-engine-json-rule-engine';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { formatIntoAcaError, throwAcaError, ACA_ERROR_TYPE, appendDataToError } = require('@ibm-aca/aca-utils-errors');

const { Engine } = require('@ibm-aca/aca-json-rules-engine');
const { AcaRuleEngineV2 } = require('../rule-engine');

const { getAcaRulesDatasourceV2ByTenant } = require(`@ibm-aca/aca-rules-datasource-provider-v2`);

const { rulesService } = require('@ibm-aca/aca-rules-service-v2');

const {
  AIAP_EVENT_TYPE,
  getEventStreamByTenant,
} = require('@ibm-aiap/aiap-event-stream-provider');

const _transformers = require('./transformers');
const _document = require('./document');

class AcaRuleEngineV2JsonRuleEngine extends AcaRuleEngineV2 {

  constructor(configuration) {
    super();
    this.type = 'json-rule-engine';
    this.status = AcaRuleEngineV2.STATUS.OFFLINE;
    try {
      if (
        lodash.isEmpty(configuration)
      ) {
        const MESSAGE = 'Missing required configuration parameter!';
        throwAcaError(MODULE_ID, ACA_ERROR_TYPE.INITIALIZATION_ERROR, MESSAGE);
      }
      this.configuration = configuration;
      this._subscribeToEvents();
    } catch (error) {
      const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
      logger.error(`constructor`, ACA_ERROR);
      throw ACA_ERROR;
    }
  }

  _subscribeToEvents() {
    const EVENT_STREAM = getEventStreamByTenant(this.configuration?.tenant);
    const CHANNEL = `${AIAP_EVENT_TYPE.RESET_RULES_ENGINE_V2}:${this.configuration?.engagement?.key}`;
    EVENT_STREAM.subscribe(CHANNEL, async (event) => {
      logger.info(`Processing ${AIAP_EVENT_TYPE.RESET_RULES_ENGINE_V2} event!`, { event });
      this.initialize();
    });
    logger.info(`Subscribed to events channel -> ${CHANNEL}!`);
  }

  _addCustomFacts() { }

  _addCustomOperators() { }

  async initialize() {
    let context;
    let tenantId;
    let tenantHash;
    let engagementId;
    let options;
    try {
      tenantId = this.configuration?.tenant?.id;
      tenantHash = this.configuration?.tenant?.hash;
      engagementId = this.configuration?.engagement?.id;
      options = this.configuration?.options;
      if (
        lodash.isEmpty(tenantId)
      ) {
        const ERROR_MESSAGE = `Missing required this.configuration?.tenant?.id attribute!`;
        throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, ERROR_MESSAGE);
      }
      if (
        lodash.isEmpty(tenantHash)
      ) {
        const ERROR_MESSAGE = `Missing required this.configuration?.tenant?.hash attribute!`;
        throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, ERROR_MESSAGE);
      }
      if (
        lodash.isEmpty(engagementId)
      ) {
        const ERROR_MESSAGE = `Missing required this.configuration?.engagement?.id attribute!`;
        throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, ERROR_MESSAGE);
      }
      if (
        lodash.isEmpty(options)
      ) {
        const ERROR_MESSAGE = `Missing required this.configuration?.options attribute!`;
        throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, ERROR_MESSAGE);
      }
      this._engine = new Engine([], this.configuration?.options);
      this._addCustomFacts();
      this._addCustomOperators();
      const DATASOURCE = getAcaRulesDatasourceV2ByTenant(this.configuration?.tenant);
      if (
        lodash.isEmpty(DATASOURCE)
      ) {
        const MESSAGE = 'Unable to retrieve rulesV2 datasource!';
        throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, MESSAGE);
      }
      let query = {
        filter: {
          engagement: {
            id: engagementId,
          },
          status: {
            enabled: true
          }
        },
        pagination: {
          page: 1,
          size: 10000
        }
      }
      context = {
        user: { session: { tenant: this.configuration?.tenant } }
      };

      const RESPONSE = await rulesService.findManyWithConditionsByQuery(
        context,
        { query },
      );

      this.rules = RESPONSE?.items || [];
      const RULES_NATIVE_FORMAT = _transformers.rulesToNativeFormat(
        context,
        { rules: this.rules }
      );
      const RULES_NATIVE_FORMAT_KEYS = Object.keys(RULES_NATIVE_FORMAT);
      for (let key of RULES_NATIVE_FORMAT_KEYS) {
        let ruleNativeFormat = RULES_NATIVE_FORMAT[key];
        this._engine.addRule(ruleNativeFormat);
      }
      this.status = AcaRuleEngineV2.STATUS.ONLINE;
      logger.info(`Initialized!`, {
        tenantId,
        tenantHash,
        engagementId,
      });
    } catch (error) {
      const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
      appendDataToError(
        ACA_ERROR,
        {
          tenant: {
            id: tenantId,
            hash: tenantHash,
          }
        }
      );
      logger.error('initialize', { ACA_ERROR });
      throw ACA_ERROR;
    }
  }

  isOnline() {
    return AcaRuleEngineV2.STATUS.ONLINE === this.status;
  }

  get document() {
    const RET_VAL = {
      validateOne: (context, params) => {
        return _document.validateOne(this._engine, context, params);
      },
      validateMany: (context, params) => {
        return _document.validateMany(this._engine, context, params);
      },
    };
    return RET_VAL;
  }

}

module.exports = {
  AcaRuleEngineV2JsonRuleEngine,
}
