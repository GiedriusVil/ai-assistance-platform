/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'tenants-cache-provider-find-one-by-external-id';
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
  reloadOneByExternalId,
} from './reload-one-by-external-id';

const _retrieveTenant = async (
  externalId: any,
) => {
  const MEMORY_STORE = getMemoryStore();
  const RET_VAL = await MEMORY_STORE.get(`TENANTS_BY_EXTERNAL_ID:${externalId}`);
  return RET_VAL;
}

export const findOneByExternalId = async (
  params: {
    externalId: any,
  },
) => {
  let externalId;
  try {
    externalId = params?.externalId;
    if (
      lodash.isEmpty(externalId)
    ) {
      const MESSAGE = 'Missing required params.externalId parameter!';
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }
    let retVal = await _retrieveTenant(externalId);
    if (
      lodash.isEmpty(retVal)
    ) {
      await reloadOneByExternalId(params);
      retVal = await _retrieveTenant(externalId);
    }
    return retVal;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(findOneByExternalId.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}
