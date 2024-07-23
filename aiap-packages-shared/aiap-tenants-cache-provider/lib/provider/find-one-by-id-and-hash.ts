/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'tenants-cache-provider-find-one-by-id-and-hash';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import lodash from '@ibm-aca/aca-wrapper-lodash';

import {
  ACA_ERROR_TYPE,
  formatIntoAcaError,
  throwAcaError,
} from '@ibm-aca/aca-utils-errors';

import {
  getMemoryStore,
} from '@ibm-aiap/aiap-memory-store-provider';

import {
  getDatasourceV1App,
} from '@ibm-aiap/aiap-app-datasource-provider';

import {
  reloadOne,
} from '@ibm-aiap/aiap-tenants-resources-loader';


const _reloadOneIfExistsInDB = async (
  params: {
    id: any,
    hash: any,
  },
) => {
  const APP_DATASOURCE = getDatasourceV1App();
  const CONTEXT = {};
  const TENANT = await APP_DATASOURCE.tenants.findOneByIdAndHash(CONTEXT, params);
  if (
    !lodash.isEmpty(TENANT)
  ) {
    await reloadOne(TENANT);
  }
}

export const findOneByIdAndHash = async (
  params: {
    id: any,
    hash: any,
  },
) => {
  try {
    const ID = params?.id;
    const HASH = params?.hash;
    if (
      lodash.isEmpty(ID)
    ) {
      const MESSAGE = 'Missing params.id required parameter!';
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE, { params })
    }
    if (
      lodash.isEmpty(HASH)
    ) {
      const MESSAGE = 'Missing params.hash required parameter!';
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE, { params })
    }
    const MEMORY_STORE = getMemoryStore();
    let retVal = await MEMORY_STORE.get(`TENANTS:${ID}:${HASH}`);
    if (
      lodash.isEmpty(retVal)
    ) {
      await _reloadOneIfExistsInDB({ id: ID, hash: HASH });
    }
    retVal = await MEMORY_STORE.get(`TENANTS:${ID}:${HASH}`);
    return retVal;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(findOneByIdAndHash.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}
