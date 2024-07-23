/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'app-service-configuration';
const ramda = require('ramda');
const lodash = require('lodash');

const { DEFAULT_SERVICE_SCHEMA } = require('./schema');
const { transformRawConfiguration } = require('./transformer');

let _provider;
let _configuration;

const setConfigurationProvider = (provider) => {
  if (
    lodash.isEmpty(provider)
  ) {
    const ACA_ERROR = {
      type: 'INITIALIZATION_ERROR',
      message: `[${MODULE_ID}] Missing required provider parameter! [aca-common-config || aca-lite-config]`,
    };
    throw ACA_ERROR;
  }
  _provider = provider;
}

const setConfiguration = (configuration) => {
  _configuration = configuration;
};

const getConfiguration = () => {
  if (_provider) {
    _configuration = _provider.getConfiguration();
  }
  return _configuration;
}

const getLibConfiguration = () => {
  const RET_VAL = ramda.path([Configurator.NAME], getConfiguration());
  return RET_VAL;
}

const ensureConfigurationExists = () => {
  const CONFIG = getConfiguration();
  if (ramda.isNil(CONFIG)) {
    throw new Error('[ACA] Configuration is missing!');
  }
}

class Configurator {

  static NAME = 'appService';

  static async transformRawConfiguration(rawConfiguration, provider) {
    const RET_VAL = await transformRawConfiguration(rawConfiguration, provider);
    return RET_VAL;
  }

  static attachToJoiSchema(schema) {
    return schema.append(Configurator.schema());
  }

  static schema() {
    const RET_VAL = {
      [Configurator.NAME]: DEFAULT_SERVICE_SCHEMA,
    };
    return RET_VAL;
  }

  static async loadConfiguration(RET_VAL, rawConfiguration, provider) {
    if (lodash.isEmpty(RET_VAL)) {
      const ACA_ERROR = {
        type: 'VALIDATION_ERROR',
        message: `[${MODULE_ID}] Missing required transformer schema!`
      };
      throw ACA_ERROR;
    }
    RET_VAL[Configurator.NAME] = await Configurator.transformRawConfiguration(rawConfiguration, provider);
  }
}

export {
  ensureConfigurationExists,
  setConfigurationProvider,
  setConfiguration,
  getConfiguration,
  getLibConfiguration,
  Configurator
}
