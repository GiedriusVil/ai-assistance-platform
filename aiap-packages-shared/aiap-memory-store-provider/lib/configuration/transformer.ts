/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import lodash from '@ibm-aca/aca-wrapper-lodash';

const store = (
  flatStore: any,
) => {
  let retVal;
  if (
    !lodash.isEmpty(flatStore)
  ) {
    retVal = {
      name: flatStore.name,
      type: flatStore.type,
      expiration: flatStore.expiration || 5000,
      keyPrefix: flatStore.keyPrefix,
      client: flatStore.client
    };
  }
  return retVal;
}

const stores = (
  flatStores: Array<any>,
) => {
  const RET_VAL = [];
  if (
    !lodash.isEmpty(flatStores) &&
    lodash.isArray(flatStores)
  ) {
    for (const FLAT_STORE of flatStores) {
      const STORE = store(FLAT_STORE)
      if (
        !lodash.isEmpty(STORE)
      ) {
        RET_VAL.push(STORE);
      }
    }
  }
  return RET_VAL;
}

export const transformRawConfiguration = async (
  rawConfiguration: any,
  provider: any,
) => {
  const STORES_FLAT = provider.getKeys(
    'MEMORY_STORE_PROVIDER',
    [
      'NAME',
      'TYPE',
      'KEY_PREFIX',
      'EXPIRATION',
      'CLIENT'
    ]
  );
  const STORES = stores(STORES_FLAT);
  const RET_VAL = provider.isEnabled('MEMORY_STORE_PROVIDER_ENABLED', false, {
    stores: STORES
  });
  return RET_VAL;
}
