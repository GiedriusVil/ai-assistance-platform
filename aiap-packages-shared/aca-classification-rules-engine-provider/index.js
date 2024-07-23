/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-classification-rules-engine-provider';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const ramda = require('@ibm-aca/aca-wrapper-ramda');
const lodash = require('@ibm-aca/aca-wrapper-lodash');
const { throwAcaError, ACA_ERROR_TYPE, formatIntoAcaError } = require('@ibm-aca/aca-utils-errors');

const { setConfigurationProvider, getConfiguration } = require('./lib/configuration');

const { AcaClassificationRuleEngineJsonRuleEngine } = require('./lib/rule-engine-json-rule-engine');
const { retrieveEngineIdFromContext } = require('./lib/utils');

const ENGINES = {};

const initByConfigurationProvider = async (configurationProvider) => {
  try {
    if (
      lodash.isEmpty(configurationProvider)
    ) {
      const MESSAGE = `Missing required configuration provider! [aca-common-config || aca-lite-config]`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.INITIALIZATION_ERROR, MESSAGE);
    }
    setConfigurationProvider(configurationProvider);
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(`${initByConfigurationProvider.name}`, { ACA_ERROR });
    throw ACA_ERROR;
  }
};

const getAcaClassificationRulesEngines = () => {
  return ENGINES;
};

const getAcaClassificationRulesEngineByContext = async (context) => {
  try {
    const ENGINE_ID = retrieveEngineIdFromContext(context);
    if (
      lodash.isEmpty(ENGINE_ID)
    ) {
      const MESSAGE = `Received invalid context! Unable construct ENGINE_ID`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, MESSAGE);
    }
    const ENGINE = ENGINES[ENGINE_ID];
    const ENGINE_STATUS = ramda.path(['status'], ENGINE);
    if (
      lodash.isEmpty(ENGINE_STATUS)
    ) {
      await initAcaClassificationRulesEngineByContext(context);
    } else if (
      ENGINE_STATUS !== 'online'
    ) {
      await initAcaClassificationRulesEngineByContext(context);
    }
    const RET_VAL = ENGINES[ENGINE_ID];
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error('->', { ACA_ERROR });
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
        PROMISES.push(initAcaClassificationRulesEngineByContext(engine.context));
      }
    }
  }
}

const resetAcaClassificationRulesEngineByContext = async (context, params) => {
  try {
    const ENGINE_ID = retrieveEngineIdFromContext(context);
    await deleteAcaClassificationRulesEngineByContext(context);
    initAcaClassificationRulesEngineByContext(context);
    const RET_VAL = {
      engineID: ENGINE_ID,
      status: 'RESET'
    };
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(`${resetAcaClassificationRulesEngineByContext.name}`, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

const deleteAcaClassificationRulesEngineByContext = async (context) => {
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
    logger.error(`${deleteAcaClassificationRulesEngineByContext.name}`, { ACA_ERROR });
    throw ACA_ERROR;
  }
};

const initAcaClassificationRulesEngineByContext = async (context) => {
  try {
    const ENGINE_ID = retrieveEngineIdFromContext(context);
    const JSON_RULE_ENGINE_CONFIG = ramda.path(['acaClassificationRulesEngineProvider', 'jsonRuleEngine'], getConfiguration());
    const ENGINE = new AcaClassificationRuleEngineJsonRuleEngine(JSON_RULE_ENGINE_CONFIG, context);
    await ENGINE.initialize();
    ENGINES[ENGINE_ID] = ENGINE;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(`${initAcaClassificationRulesEngineByContext.name}`, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

module.exports = {
  initByConfigurationProvider,
  getAcaClassificationRulesEngines,
  getAcaClassificationRulesEngineByContext,
  resetAllEngines,
  resetAcaClassificationRulesEngineByContext,
  deleteAcaClassificationRulesEngineByContext,
  initAcaClassificationRulesEngineByContext,
};
