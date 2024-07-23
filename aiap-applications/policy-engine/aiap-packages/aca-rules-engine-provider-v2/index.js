/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-rules-engine-provider-v2-index';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { formatIntoAcaError, throwAcaError, ACA_ERROR_TYPE, appendDataToError } = require('@ibm-aca/aca-utils-errors');
const { setConfigurationProvider, getLibConfiguration } = require('./lib/configuration');

const { AcaRuleEngineV2JsonRuleEngine } = require('./lib/rule-engine-json-rule-engine');

const { constructEngineIdByContext } = require('./lib/utils');

const ENGINES = {};

const initByConfigurationProvider = async (configurationProvider) => {
  try {
    if (
      lodash.isEmpty(configurationProvider)
    ) {
      const MESSAGE = 'Missing required configuration provider parameter!';
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.INITIALIZATION_ERROR, MESSAGE);
    }
    setConfigurationProvider(configurationProvider);
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(initByConfigurationProvider.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
};

const _ensureAcaRulesEngineV2ByContext = async (context) => {
  let engineId;
  let engine;
  let configuration;
  try {
    engineId = constructEngineIdByContext(context);
    configuration = {
      tenant: context?.user?.session?.tenant,
      engagement: {
        id: context?.user?.session?.engagement?.id,
        key: context?.user?.session?.engagement?.key,
      },
      options: getLibConfiguration()?.jsonRuleEngine,
    }
    engine = ENGINES[engineId];
    if (
      lodash.isEmpty(engine)
    ) {
      logger.info(`Unable to retrieve engine by id! --> Creating new one!`, { engineId });
      engine = new AcaRuleEngineV2JsonRuleEngine(configuration);
      await engine.initialize();
      ENGINES[engineId] = engine;
    }
    if (
      !engine.isOnline()
    ) {
      logger.info('Engine is not ready to use. Re-initializing!', { engineId });
      await engine.initialize();
    }
    const RET_VAL = { engineId };
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, { engineId });
    logger.error(_ensureAcaRulesEngineV2ByContext.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

const getAcaRulesEngineV2ByContext = async (context) => {
  let engineId;
  let retVal;
  try {
    engineId = constructEngineIdByContext(context);
    await _ensureAcaRulesEngineV2ByContext(context);
    retVal = ENGINES[engineId];
    return retVal;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, { engineId });
    logger.error(getAcaRulesEngineV2ByContext.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
};

const getAcaRulesEnginesV2 = () => {
  return ENGINES;
};

module.exports = {
  initByConfigurationProvider,
  getAcaRulesEngineV2ByContext,
  getAcaRulesEnginesV2,
};
