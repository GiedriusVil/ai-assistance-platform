/*
    © Copyright IBM Corporation 2022. All Rights Reserved 
     
    SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-engagements-datasource-provider-configuration';

import ramda from '@ibm-aca/aca-wrapper-ramda';
import lodash from '@ibm-aca/aca-wrapper-lodash';

import {
  ACA_ERROR_TYPE,
  throwAcaError,
} from '@ibm-aca/aca-utils-errors';


import {
  ENGAGEMENTS_DATASOURCE_PROVIDER_SCHEMA
} from './schema';

import {
  transformRawConfiguration
} from './transformer';

let _provider;
let _configuration;

const setConfigurationProvider = (
  provider: any
) => {
  if (
    ramda.isNil(provider)
  ) {
    const MESSAGE = `Missing required configuration provider! [aca-lite-config || aca-common-config]`;
    throwAcaError(MODULE_ID, ACA_ERROR_TYPE.INITIALIZATION_ERROR, MESSAGE);
  }
  _provider = provider;
}

const setConfiguration = (
  configuration: any
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
  const CONFIG = getConfiguration();
  if (
    ramda.isNil(CONFIG)
  ) {
    const MESSAGE = `Missing required configuration!`;
    throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
  }
}

class Configurator {

  static NAME = 'engagementsDatasourceProvider';

  static async transformRawConfiguration(rawConfiguration, provider) {
    const RET_VAL = await transformRawConfiguration(rawConfiguration, provider);
    return RET_VAL;
  }

  static attachToJoiSchema(schema) {
    return schema.append(Configurator.schema());
  }

  static schema() {
    const RET_VAL = {
      [Configurator.NAME]: ENGAGEMENTS_DATASOURCE_PROVIDER_SCHEMA,
    };
    return RET_VAL;
  }

  static async loadConfiguration(RET_VAL, rawConfiguration, provider) {
    if (
      lodash.isEmpty(RET_VAL)
    ) {
      const MESSAGE = `Missing required configuration root object!`;
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
}
