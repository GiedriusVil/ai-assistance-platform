/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-lite-config-lib';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const { throwAcaError, ACA_ERROR_TYPE } = require('@ibm-aca/aca-utils-errors');

const config = require('./config');

const commonTransformer = require('./common-transformer');

const loader = require('./loader');

const { transform } = require('./transformer');

const { getRegistry } = require('@ibm-aiap/aiap-secrets-manager-adapter-provider');


let configuration;

const loadConfiguration = async () => {
  const CONFIG_TYPE = process.env.CONFIG_TYPE;
  if (!CONFIG_TYPE) {
    configuration = transform(process.env);
  }
  return configuration;
}

const getConfiguration = () => {
  if (!configuration) {
    throw new Error('[AIAP] First load configuration!');
  }
  return configuration;
}

const mergeConfiguration = async (userConfig, userSchema) => {
  const CONFIGURATION_COMMON = commonTransformer.getConfiguration();
  configuration = {
    ...CONFIGURATION_COMMON,
    ...config.config(userConfig, userSchema),
  };
  await loadSecretsManager();
  return configuration;
}

const load = async (loaderOpts = {}, opts) => {
  try {
    configuration = await loader(loaderOpts, opts);

    config.enrichByLoadedConfiguration(configuration);
    commonTransformer.enrichByLoadedConfiguration(configuration);

    return configuration;
  } catch (err) {
    const ERROR_MESSAGE = `Could not load configuration! ${err}`;
    throw new Error(ERROR_MESSAGE);
  }
}

const loadSecretsManager = async () => {
  const SECRETS_MANAGER_ADAPTER_TYPE = process.env.AIAP_SECRETS_MANAGER_ADAPTER_TYPE;
  if (process.env.SECRETS_MANAGER_CLIENTS_PROVIDER_ENABLED === 'true' && SECRETS_MANAGER_ADAPTER_TYPE) {

    const secretsManagerAdapter = getRegistry()?.[SECRETS_MANAGER_ADAPTER_TYPE];
    if (!secretsManagerAdapter) {
      const MESSAGE = `Adapter type - '${SECRETS_MANAGER_ADAPTER_TYPE}' does not exist.`
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }

    const CONFIGURATION_PROVIDER = { configuration, loadConfiguration, getConfiguration };
    await secretsManagerAdapter.initAdapterClientProviderByConfigurationProvider(CONFIGURATION_PROVIDER);

    const RET_VAL = await secretsManagerAdapter.secrets.setSecretKeyValues(configuration);

    if (RET_VAL) {
      configuration = RET_VAL;
    }
  }
}

module.exports = {
  load: load,
  loadConfiguration: loadConfiguration,
  getConfiguration: getConfiguration,
  mergeConfiguration: mergeConfiguration,
  environment: config.environment,
  build: config.build,
  space: config.space,
  namespace: config.namespace,
  isLocal: config.isLocal,
  isFeatureEnabled: config.isFeatureEnabled,
  isEnabled: config.isEnabled,
  getKeys: config.getKeys,
  validate: config.validate,
  isTrue: config.isTrue,
}
