/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'main-stream-events-handler-configuration';

import lodash from '@ibm-aca/aca-wrapper-lodash';
import ramda from '@ibm-aca/aca-wrapper-ramda';

import {
  ACA_ERROR_TYPE,
  throwAcaError,
} from '@ibm-aca/aca-utils-errors';

let _provider;
let _configuration;

const setConfigurationProvider = (
  provider: any,
) => {
  if (
    lodash.isEmpty(provider)
  ) {
    const MESSAGE = 'Missing required configuration provider!'
    throwAcaError(MODULE_ID, ACA_ERROR_TYPE.INITIALIZATION_ERROR, MESSAGE);
  }
  _provider = provider;
}

const setConfiguration = (
  configuration: any,
) => {
  _configuration = configuration;
};

const getConfiguration = () => {
  if (
    _provider
  ) {
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

  if (
    lodash.isEmpty(CONFIG)
  ) {
    const MESSAGE = 'Missing configuration!';
    throwAcaError(MODULE_ID, ACA_ERROR_TYPE.INITIALIZATION_ERROR, MESSAGE);
  }
}

import {
  SCHEMA,
} from './schema';

import {
  transformRawConfiguration,
} from './transformer';

class Configurator {

  static NAME = 'mainEventStreamHandler';

  static schema() {
    const RET_VAL = {
      [Configurator.NAME]: SCHEMA,
    };
    return RET_VAL;
  }

  static attachToJoiSchema(schema) {
    return schema.append(Configurator.schema());
  }

  static async transformRawConfiguration(
    rawConfiguration: any,
    provider: any,
  ) {
    const RET_VAL = await transformRawConfiguration(rawConfiguration, provider);
    return RET_VAL;
  }

  static async loadConfiguration(
    container: any,
    rawConfiguration: any,
    provider: any,
  ) {
    if (
      lodash.isEmpty(container)
    ) {
      const ERROR_MESSAGE = 'Missing required root container!';
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.INITIALIZATION_ERROR, ERROR_MESSAGE);
    }
    container[Configurator.NAME] = await Configurator.transformRawConfiguration(rawConfiguration, provider);
  }
}

export {
  ensureConfigurationExists,
  setConfigurationProvider,
  setConfiguration,
  getConfiguration,
  getLibConfiguration,
  Configurator,
}
