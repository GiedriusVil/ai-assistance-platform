/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'ai-services-datasource-provider-configuration';

import ramda from '@ibm-aca/aca-wrapper-ramda';
import lodash from '@ibm-aca/aca-wrapper-lodash';

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
    ramda.isNil(provider)
  ) {
    const ERROR_MESSAGE = `Configuration provider is missing! [aca-lite-config]`;
    throwAcaError(MODULE_ID, ACA_ERROR_TYPE.INITIALIZATION_ERROR, ERROR_MESSAGE);
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

const ensureConfigurationExists = () => {
  const CONFIGURATION = getConfiguration();
  if (
    ramda.isNil(CONFIGURATION)
  ) {
    const MESSAGE = 'Missing required configuration!';
    throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
  }
}

import { SCHEMA } from './schema';
import { transformRawConfiguration } from './transformer';

class Configurator {

  static NAME = 'aiServicesDatasourceProvider';

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
      const ERROR_MESSAGE = 'Missing required transformer schema!';
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, ERROR_MESSAGE);
    }
    RET_VAL[Configurator.NAME] = await Configurator.transformRawConfiguration(rawConfiguration, provider);
  }
}

export {
  ensureConfigurationExists,
  setConfigurationProvider,
  setConfiguration,
  getConfiguration,
  Configurator
}
