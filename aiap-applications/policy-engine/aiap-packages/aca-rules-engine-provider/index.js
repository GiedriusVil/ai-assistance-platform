/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-rules-engine-provider';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const ramda = require('@ibm-aca/aca-wrapper-ramda');
const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { formatIntoAcaError, throwAcaError, ACA_ERROR_TYPE } = require('@ibm-aca/aca-utils-errors');
const { setConfigurationProvider, getLibConfiguration } = require('./lib/configuration');

const { AcaRuleEngineJsonRuleEngine } = require('./lib/rule-engine-json-rule-engine');
const { retrieveEngineIdFromContext } = require('./lib/utils');

const ENGINES = {};

const initByConfigurationProvider = async (configurationProvider) => {
  if (
    lodash.isEmpty(configurationProvider)
  ) {
    const MESSAGE = 'Missing required configuration provider parameter!';
    throwAcaError(MODULE_ID, ACA_ERROR_TYPE.INITIALIZATION_ERROR, MESSAGE);
  }
  setConfigurationProvider(configurationProvider);
};

const getAcaRulesEngines = () => {
  return ENGINES;
};

const getAcaRulesEngineByContext = async (context) => {
  try {
    const ENGINE_ID = retrieveEngineIdFromContext(context);
    if (
      lodash.isEmpty(ENGINE_ID)
    ) {
      const MESSAGE = 'Received invalid context! Unable construct ENGINE_ID!';
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, MESSAGE);
    }
    const ENGINE = ENGINES[ENGINE_ID];
    const ENGINE_STATUS = ENGINE?.status;
    if (
      lodash.isEmpty(ENGINE_STATUS)
    ) {
      await initAcaRulesEngineByContext(context);
    } else if (
      ENGINE_STATUS !== 'online'
    ) {
      await initAcaRulesEngineByContext(context);
    }
    const RET_VAL = ENGINES[ENGINE_ID];
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(getAcaRulesEngineByContext.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
};

const resetAllEngines = async () => {
  const ENGINE_IDS = Object.keys(ENGINES);
  if (
    !lodash.isEmpty(ENGINE_IDS) &&
    lodash.isArray(ENGINE_IDS)
  ) {
    const PROMISES = [];
    for (let engineId of ENGINE_IDS) {
      let engine = ENGINES[engineId];
      if (
        engine &&
        engine.context
      ) {
        PROMISES.push(initAcaRulesEngineByContext(engine.context));
      }
    }
  }
}

const resetAcaRulesEngineByContext = async (context, params) => {
  try {
    const ENGINE_ID = retrieveEngineIdFromContext(context);
    await deleteAcaRulesEngineByContext(context);
    initAcaRulesEngineByContext(context);
    const RET_VAL = {
      engineID: ENGINE_ID,
      status: 'RESET'
    };
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(resetAcaRulesEngineByContext.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

const deleteAcaRulesEngineByContext = async (context) => {
  try {
    const ENGINE_ID = retrieveEngineIdFromContext(context);
    delete ENGINES[ENGINE_ID];
    const RET_VAL = {
      engineID: ENGINE_ID,
      status: 'DELETED'
    };
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(deleteAcaRulesEngineByContext.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
};

const initAcaRulesEngineByContext = async (context) => {
  try {
    const ENGINE_ID = retrieveEngineIdFromContext(context);
    const JSON_RULE_ENGINE_CONFIG = ramda.path(['jsonRuleEngine'], getLibConfiguration());
    const ENGINE = new AcaRuleEngineJsonRuleEngine(JSON_RULE_ENGINE_CONFIG, context);

    await ENGINE.initialize();

    ENGINES[ENGINE_ID] = ENGINE;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(initAcaRulesEngineByContext.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

module.exports = {
  initByConfigurationProvider,
  getAcaRulesEngines,
  getAcaRulesEngineByContext,
  resetAllEngines,
  resetAcaRulesEngineByContext,
  deleteAcaRulesEngineByContext,
  initAcaRulesEngineByContext,
};
