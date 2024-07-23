/*
   © Copyright IBM Corporation 2022. All Rights Reserved 
    
   SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'jwt-provider';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import ramda from '@ibm-aca/aca-wrapper-ramda';
import lodash from '@ibm-aca/aca-wrapper-lodash';

import {
  ACA_ERROR_TYPE,
  throwAcaError,
} from '@ibm-aca/aca-utils-errors';

import {
  getConfiguration,
  setConfigurationProvider,
  Configurator,
} from './lib/configuration';

import {
  JWTProviderV1JsonWebToken,
} from './lib/jwt-provider-jsonwebtoken';

let jwtProvider;

const _initAcaJwtProvider = (config) => {
  if (
    lodash.isEmpty(config)
  ) {
    const MESSAGE = `Missing jwt-provider configuration!`;
    throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
  }
  jwtProvider = new JWTProviderV1JsonWebToken(config);
}

const initByConfigurationProvider = async (
  provider: any,
) => {
  if (
    lodash.isEmpty(provider)
  ) {
    const MESSAGE = `Missing required configuration provider!`;
    throwAcaError(MODULE_ID, ACA_ERROR_TYPE.INITIALIZATION_ERROR, MESSAGE);
  }
  setConfigurationProvider(provider);
  const PROVIDER_CONFIG = ramda.path([Configurator.NAME], getConfiguration());
  if (PROVIDER_CONFIG) {
    _initAcaJwtProvider(PROVIDER_CONFIG);
  } else {
    logger.warn('Disabled by configuration!');
  }
}

const getJwtProviderV1 = (
  params = {}
) => {
  return jwtProvider;
}

export {
  initByConfigurationProvider,
  getJwtProviderV1,
}
