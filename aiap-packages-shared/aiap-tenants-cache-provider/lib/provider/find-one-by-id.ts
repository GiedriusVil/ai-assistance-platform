/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'tenants-store-tenants-find-one-by-id';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import lodash from '@ibm-aca/aca-wrapper-lodash';

import {
  ACA_ERROR_TYPE,
  formatIntoAcaError,
  throwAcaError,
} from '@ibm-aca/aca-utils-errors'

import {
  getMemoryStore,
} from '@ibm-aiap/aiap-memory-store-provider';

import {
  reloadOneById,
} from './reload-one-by-id';

export const findOneById = async (
  params: {
    id: any,
  },
) => {
  try {
    const ID = params?.id;
    if (
      lodash.isEmpty(ID)
    ) {
      const ERROR_MESSAGE = 'Missing required params.id parameter!';
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, ERROR_MESSAGE);
    }
    const MEMORY_STORE = getMemoryStore();
    let retVal = await MEMORY_STORE.get(`TENANTS:${ID}`);
    if (
      lodash.isEmpty(retVal)
    ) {
      await reloadOneById(params);
    }
    retVal = await MEMORY_STORE.get(`TENANTS:${ID}`);
    return retVal;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(findOneById.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}
