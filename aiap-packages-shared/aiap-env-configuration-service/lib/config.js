/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/

const lodash = require('@ibm-aca/aca-wrapper-lodash');
const ramda = require('@ibm-aca/aca-wrapper-ramda');

let loadedConfig;

const _enrichByLoadedConfiguration = (configuration) => {
  loadedConfig = configuration;
};

const _build = () => {
  const RET_VAL = loadedConfig.BUILD || 'local';
  return RET_VAL;
};

const _isLocal = () => {
  const RET_VAL = _build() === 'local';
  return RET_VAL;
};

const _environment = () => {
  if (
    _isLocal()
  ) {
    return 'local'
  }
  if (
    !loadedConfig.ENV
  ) {
    const ERROR_MESSAGE = 'ENV environment variable is not defined.';
    throw new Error(ERROR_MESSAGE);
  }
  return loadedConfig.ENV;
};

const _space = () => {
  if (
    _isLocal()
  ) {
    return 'local';
  }
  if (
    !loadedConfig.SPACE
  ) {
    const ERROR_MESSAGE = 'SPACE environment variable is not defined.';
    throw new Error(ERROR_MESSAGE);
  }
  return loadedConfig.SPACE;
};

const _namespace = () => {
  if (
    _isLocal()
  ) {
    return 'local'
  }
  return `${_space()}-${_environment()}-${_build()}`;
};

const _isEnabled = (envVar, def, value) => {
  const FALSE = ['false', 'disabled', 'no'];
  const TRUE = ['true', 'enabled', 'yes'];

  const isValidValue = (list, val) => ramda.any(ramda.equals(val), list);
  const isTruthyString = ramda.curry(isValidValue)(TRUE);
  const isFalsyString = ramda.curry(isValidValue)(FALSE);

  const variable = (envVar && loadedConfig[envVar]) || def;

  const disabled = !variable || isFalsyString(variable);
  const enabled = !disabled || isTruthyString(variable);

  // return value as default if value is specified and default is true, otherwise use default
  const returnValue = value || (isTruthyString(variable) ? enabled : variable);
  return enabled && returnValue;
};

const _toCamelCase = (str) => {
  const RET_VAL = str
    .toLowerCase()
    .replace(/^([A-Z])|[\s-_](\w)/g, (match, p1, p2) => (p2 ? p2.toUpperCase() : p1.toLowerCase()));

  return RET_VAL;
}

const _getKeys = (envVarTemplate, items = []) => {
  let values = [];
  let index = 0;
  let value;

  const _reducer = (val, item) => ({
    ...val,
    ...(loadedConfig[`${envVarTemplate}_${index}_${item}`]
      ? {
        [_toCamelCase(item)]: loadedConfig[`${envVarTemplate}_${index}_${item}`],
      }
      : {}),
  });

  do {
    const defaultValue = loadedConfig[`${envVarTemplate}_${index}`];
    value = items.reduce(_reducer, {});
    if (
      ramda.isEmpty(value)
    ) {
      value = defaultValue
    }
    if (
      value !== undefined
    ) {
      values.push(value)
    }
    index++
  } while (value !== undefined);

  return values;
};

const _getNamedKeys = (envVarTemplates = [], names = {}, replace = '') => {
  let values = {};
  Object.keys(names).forEach(name => {
    let keys = {};
    envVarTemplates.forEach(envVar => {
      keys[_toCamelCase(envVar.replace(replace, ''))] = loadedConfig[`${envVar}_${name}`]
        ? loadedConfig[`${envVar}_${name}`]
        : loadedConfig[`${envVar}`];
    });
    values[name] = {
      ...keys,
    };
    keys = {};
  });
  return values;
};

const _isFeatureEnabled = (config) => (feature) => {
  const RET_VAL = !!ramda.view(ramda.lensPath(['features', _space(), feature]), config);
  return RET_VAL;
}

const _validate = (config, schema) => {
  const result = schema?.validate(config);
  if (
    result.error
  ) {
    const ERROR_MESSAGE = `Configuration validation failed: ${result.error}`;
    throw new Error(ERROR_MESSAGE);
  }
  return result.value;
};

const _isTrue = (value) => {
  let retVal = false;
  if (
    lodash.isString(value) &&
    value === 'true'
  ) {
    retVal = true;
  } else if (
    lodash.isBoolean(value) &&
    value
  ) {
    retVal = true;
  }
  return retVal;
};

const _config = (config, schema) => {
  const RET_VAL = ramda.mergeRight(
    schema ?
      _validate(config, schema) :
      config,
    {
      env: _build(),
      build: _build,
      environment: _environment,
      space: _space,
      namespace: _namespace,
      isLocal: _isLocal,
      isFeatureEnabled: _isFeatureEnabled(config),
      isEnabled: _isEnabled,
      getKeys: _getKeys,
      validate: _validate,
      isTrue: _isTrue,
    }
  );
  return RET_VAL;
}

module.exports = {
  config: _config,
  enrichByLoadedConfiguration: _enrichByLoadedConfiguration,
  build: _build,
  environment: _environment,
  space: _space,
  namespace: _namespace,
  isLocal: _isLocal,
  isFeatureEnabled: _isFeatureEnabled,
  isEnabled: _isEnabled,
  getKeys: _getKeys,
  validate: _validate,
  getNamedKeys: _getNamedKeys,
  isTrue: _isTrue,
};
