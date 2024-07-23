/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-data-masking-provider-data-masking-registry';

const ramda = require('@ibm-aca/aca-wrapper-ramda');
const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { ACA_ERROR_TYPE, throwAcaError, formatIntoAcaError } = require('@ibm-aca/aca-utils-errors');
const { Configurator, getConfiguration } = require('../configuration');

const REGISTRY = {};

const addOneToRegistry = (tenantId, maskingConfiguration) => {
  try {
    if (
      lodash.isEmpty(tenantId)
    ) {
      const MESSAGE = 'Missing tenantId required parameter! [EMPTY, NULL, UNDEFINED]';
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE, { tenantId });
    }
    if (
      lodash.isEmpty(maskingConfiguration)
    ) {
      const MESSAGE = 'Missing maskingConfiguration required parameter! [EMPTY, NULL, UNDEFINED]';
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE, { maskingConfiguration });
    }
    const DATA_MASKING_CONFIGURATION = transformMaskingConfigurationForRegistry(maskingConfiguration);
    if (lodash.isEmpty(REGISTRY[tenantId])) {
      REGISTRY[tenantId] = {};
    }
    const CONFIG_KEY = maskingConfiguration.key;
    if (DATA_MASKING_CONFIGURATION.enabled) {
      REGISTRY[tenantId][CONFIG_KEY] = DATA_MASKING_CONFIGURATION;
      console.log(`[ACA][INFO] ${MODULE_ID} -> Data masking configuration added to registry ->`, { tenant: tenantId, key: CONFIG_KEY })
    } else {
      deleteOneFromRegistry(tenantId, CONFIG_KEY);
    }

  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    console.log(`[ACA][ERROR] ${MODULE_ID} addOneToRegistry ->`, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

const deleteOneFromRegistry = (tenantId, configurationKey) => {
  try {
    if (
      lodash.isEmpty(tenantId)
    ) {
      const MESSAGE = 'Missing tenantId required parameter! [EMPTY, NULL, UNDEFINED]';
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE, { tenantId });
    }
    if (
      lodash.isEmpty(configurationKey)
    ) {
      const MESSAGE = 'Missing configurationKey required parameter! [EMPTY, NULL, UNDEFINED]';
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE, { tenantId });
    }
    delete REGISTRY[tenantId][configurationKey];
    console.log(`[ACA][INFO] ${MODULE_ID} -> Data masking configuration removed from registry ->`, { tenant: tenantId, key: configurationKey })
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    console.log(`[ACA][ERROR] ${MODULE_ID} deleteOneFromRegistry ->`, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

const getManyFromRegistry = (tenantId = undefined, patternType = undefined) => {
  if (lodash.isEmpty(REGISTRY[tenantId])) {
    REGISTRY[tenantId] = {};
  }
  const DEFAULT_PATTERNS = getDefaultPatterns();
  const RET_VAL = {};
  if (!lodash.isEmpty(DEFAULT_PATTERNS)) {
    for (let [key, value] of Object.entries(DEFAULT_PATTERNS)) {
      if (lodash.isEmpty(patternType) || value.patternType === patternType) {
        value.pattern = restorePatternFromString(value.pattern);
        RET_VAL[key] = value;
      }
    }
  }
  if (!lodash.isEmpty(tenantId)) {
    for (let [key, value] of Object.entries(REGISTRY[tenantId])) {
      if (lodash.isEmpty(patternType) || value.patternType === patternType) {
        value.pattern = restorePatternFromString(value.pattern);
        RET_VAL[key] = value;
      }
    }
  }
  return Object.values(RET_VAL);
}

const getDefaultPatterns = () => {
  const { defaultPatterns } = lodash.cloneDeep(ramda.path([Configurator.NAME], getConfiguration()));
  if (lodash.isEmpty(defaultPatterns)) {
    return undefined;
  }
  const RET_VAL = {};
  for (let defaultPattern of defaultPatterns) {
    defaultPattern.enabled = true;
    RET_VAL[defaultPattern.key] = transformMaskingConfigurationForRegistry(defaultPattern);
  }
  return RET_VAL;
}

const restorePatternFromString = (pattern) => {
  pattern = pattern.toString();
  const LAST_SLASH = pattern.lastIndexOf('/');
  const PATTERN = pattern.slice(1, LAST_SLASH);
  const FLAGS = pattern.slice(LAST_SLASH + 1);
  const RESTORED_PATTERN = new RegExp(PATTERN, FLAGS);
  return RESTORED_PATTERN;
}

const transformMaskingConfigurationForRegistry = (configuration) => {
  const CONFIGURATION_IS_ENABLED = ramda.path(['enabled'], configuration);
  const CONFIGURATION_PATTERN = ramda.path(['pattern'], configuration);
  const CONFIGURATION_REPLACE_TYPE = ramda.path(['replaceType'], configuration);
  const CONFIGURATION_PATTERN_TYPE = ramda.path(['patternType'], configuration);
  const DATA_MASKING_CONFIGURATION = {
    enabled: CONFIGURATION_IS_ENABLED,
    pattern: CONFIGURATION_PATTERN,
    replaceType: CONFIGURATION_REPLACE_TYPE,
    patternType: CONFIGURATION_PATTERN_TYPE,
  };
  return DATA_MASKING_CONFIGURATION;
}

module.exports = {
  addOneToRegistry,
  getManyFromRegistry,
  deleteOneFromRegistry,
}
