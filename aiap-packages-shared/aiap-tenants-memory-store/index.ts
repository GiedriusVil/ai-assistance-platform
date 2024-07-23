/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'tenants-memory-store-index';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import lodash from '@ibm-aca/aca-wrapper-lodash';

import {
  setConfigurationProvider,
} from './lib/configuration';

import {
  TenantsMemoryStoreV1,
} from './lib/tenants-store';

let store: TenantsMemoryStoreV1;

const initByConfigurationProvider = async (
  provider: any,
) => {
  if (
    lodash.isEmpty(provider)
  ) {
    const ACA_ERROR = {
      type: 'INITIALIZATION_ERROR',
      message: `[${MODULE_ID}] Missing required configuration provider parameter!`
    };
    throw ACA_ERROR;
  }
  setConfigurationProvider(provider);
  store = new TenantsMemoryStoreV1();
}


const getTenantsMemoryStore = () => {
  return store;
}

export {
  initByConfigurationProvider,
  getTenantsMemoryStore,
}
