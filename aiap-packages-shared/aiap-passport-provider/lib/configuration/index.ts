/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = `passport-provider-configuration-index`;

import ramda from '@ibm-aca/aca-wrapper-ramda';
import lodash from '@ibm-aca/aca-wrapper-lodash';

let _provider;
let _configuration;

const setConfigurationProvider = (
  provider: any,
) => {
  if (
    ramda.isNil(provider)
  ) {
    throw new Error('Missing configuration provider!');
  }
  _provider = provider;
}

const setConfiguration = (
  configuration: any,
) => {
  _configuration = configuration;
};

const ensureConfigurationExists = () => {
  const CONFIG = getConfiguration();
  if (
    ramda.isNil(CONFIG)
  ) {
    throw new Error('Configuration is missing!');
  }
}

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

import {
  SCHEMA,
} from './schema';

import {
  transformRawConfiguration,
} from './transformer';

class Configurator {

  static NAME = 'passportProvider';

  static async transformRawConfiguration(rawConfiguration, provider) {
    const RET_VAL = await transformRawConfiguration(rawConfiguration, provider);
    return RET_VAL;
  }

  static attachToJoiSchema(schema) {
    return schema.append(Configurator.schema());
  }

  static schema() {
    const RET_VAL = {
      [Configurator.NAME]: SCHEMA,
    };
    return RET_VAL;
  }

  static async loadConfiguration(RET_VAL, rawConfiguration, provider) {
    if (
      lodash.isEmpty(RET_VAL)
    ) {
      const ACA_ERROR = {
        type: 'VALIDATION_ERROR',
        message: `Missing required transformer schema!`
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
  Configurator,
}
