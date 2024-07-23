/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'tenants-store-tenants-retrieve-many';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import lodash from '@ibm-aca/aca-wrapper-lodash';

import {
  formatIntoAcaError,
} from '@ibm-aca/aca-utils-errors';

import {
  getMemoryStore,
} from '@ibm-aiap/aiap-memory-store-provider';

export const findManyByQuery = async (
  params: {
    //
  },
) => {
  try {
    const MEMORY_STORE = getMemoryStore();
    const TENANTS = await MEMORY_STORE.paternGet('TENANTS');

    const PATTERN = MEMORY_STORE.getKeyPrefixAbsolute();

    const TENANT_REGEX = new RegExp(PATTERN, 'g');

    const PROMISES = [];
    if (
      !lodash.isEmpty(TENANTS) &&
      lodash.isArray(TENANTS)
    ) {
      for (const TMP_TENANT of TENANTS) {
        const TMP_TENANT_ID = lodash.replace(TMP_TENANT, TENANT_REGEX, ''); // TO_DO -> pattern get should return clean ID.
        PROMISES.push(MEMORY_STORE.get(TMP_TENANT_ID));
      }
    }
    const RET_VAL = await Promise.all(PROMISES);
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(findManyByQuery.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}
