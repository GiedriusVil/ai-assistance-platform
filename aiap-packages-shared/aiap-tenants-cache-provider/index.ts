/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'tenants-cache-provider-index';

import lodash from '@ibm-aca/aca-wrapper-lodash';

import {
  ACA_ERROR_TYPE,
  throwAcaError,
} from '@ibm-aca/aca-utils-errors';

import {
  setConfigurationProvider,
} from './lib/configuration';

import {
  TenantsCacheProviderV1,
} from './lib/provider';


let _provider: TenantsCacheProviderV1;

const initByConfigurationProvider = async (
  provider: any,
) => {
  if (
    lodash.isEmpty(provider)
  ) {
    const ERROR_MESSAGE = 'Missing configuration provider!';
    throwAcaError(MODULE_ID, ACA_ERROR_TYPE.INITIALIZATION_ERROR, ERROR_MESSAGE);
  }
  setConfigurationProvider(provider);
  _provider = new TenantsCacheProviderV1();
  await _provider.initialize();
}

const getTenantsCacheProvider = () => {
  if (
    lodash.isEmpty(_provider)
  ) {
    const ERROR_MESSAGE = `Please initialise cache provider!`;
    throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, ERROR_MESSAGE);
  }
  return _provider;
}

export {
  initByConfigurationProvider,
  getTenantsCacheProvider,
}
