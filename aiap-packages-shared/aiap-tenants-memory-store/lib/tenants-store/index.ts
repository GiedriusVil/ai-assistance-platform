/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'tenants-memory-store-index';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import * as _tenants from './tenants';

export class TenantsMemoryStoreV1 {

  constructor() {
    //
  }

  get tenants() {
    const RET_VAL = {
      findOneByExternalId: (context, params) => {
        return _tenants.findOneByExternalId(context, params);
      },
      reloadOneByExternalId: (context, params) => {
        return _tenants.reloadOneByExternalId(context, params);
      }
    };
    return RET_VAL;
  }

}
