/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-lambda-modules-datasource-provider-configuration';

import lodash from '@ibm-aca/aca-wrapper-lodash';

import { throwAcaError, ACA_ERROR_TYPE } from '@ibm-aca/aca-utils-errors';

let _provider;
let _configuration;

const setConfigurationProvider = (provider) => {
  if (
    lodash.isEmpty(provider)
  ) {
    const ACA_ERROR = {
      type: 'SYSTEM_ERROR',
      message: `[${MODULE_ID}] Missing required configuration provider! Provide [aca-common-config || aca-lite-config] configuration provider!`
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

const ensureConfigurationExists = () => {
  const CONFIG = getConfiguration();
  if (
    lodash.isEmpty(CONFIG)
  ) {
    const MESSAGE = `Missing configuration!`;
    throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, MESSAGE);
  }
}

const { PROVIDER_SCHEMA } = require('./schema');
const { transformRawConfiguration } = require('./transformer');

class Configurator {

  static NAME = 'lambdaModulesDatasourceProvider';

  static async transformRawConfiguration(rawConfiguration, provider) {
    const RET_VAL = await transformRawConfiguration(rawConfiguration, provider);
    return RET_VAL;
  }

  static attachToJoiSchema(schema) {
    return schema.append(Configurator.schema());
  }

  static schema() {
    const RET_VAL = {
      [Configurator.NAME]: PROVIDER_SCHEMA,
    };
    return RET_VAL;
  }

  static async loadConfiguration(RET_VAL, rawConfiguration, provider) {
    if (
      lodash.isEmpty(RET_VAL)
    ) {
      const MESSAGE = `Missing root configuration container!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.INITIALIZATION_ERROR, MESSAGE);
    }
    RET_VAL[Configurator.NAME] = await Configurator.transformRawConfiguration(rawConfiguration, provider);
  }
}

export {
  ensureConfigurationExists,
  setConfigurationProvider,
  setConfiguration,
  getConfiguration,
  Configurator,
};
