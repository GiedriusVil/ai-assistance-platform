/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-bot-socketio-configuration-index';

import lodash from '@ibm-aca/aca-wrapper-lodash';
import ramda from '@ibm-aca/aca-wrapper-ramda';

import {
  throwAcaError,
  ACA_ERROR_TYPE,
} from '@ibm-aca/aca-utils-errors';

let _provider;
let _configuration;

const setConfigurationProvider = (
  provider: any,
) => {
  if (
    lodash.isEmpty(provider)
  ) {
    const MESSAGE = `Missing required configuration provider! [aca-lite-config]`;
    throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
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
  const CONFIGURATION = getConfiguration();
  if (
    lodash.isEmpty(CONFIGURATION)
  ) {
    const MESSAGE = `Missing library configuration!`;
    throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, MESSAGE);
  }
}

import { SCHEMA } from './schema';
import { transformRawConfiguration } from './transformer';

class Configurator {

  static NAME = 'botSocketIo';

  static async transformRawConfiguration(rawConfiguration, provider) {
    const RET_VAL = await transformRawConfiguration(rawConfiguration, provider);
    return RET_VAL;
  }

  static schema() {
    const RET_VAL = {
      [Configurator.NAME]: SCHEMA,
    };
    return RET_VAL;
  }

  static attachToJoiSchema(schema) {
    return schema.append(Configurator.schema());
  }

  static async loadConfiguration(RET_VAL, rawConfiguration, provider) {
    if (
      lodash.isEmpty(RET_VAL)
    ) {
      const MESSAGE = `Missing required root configuration container!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, MESSAGE);
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
