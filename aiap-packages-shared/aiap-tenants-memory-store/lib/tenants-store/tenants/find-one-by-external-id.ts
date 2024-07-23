/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'tenants-memory-store-find-one-by-external-id';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import lodash from '@ibm-aca/aca-wrapper-lodash';

import {
  IContextV1,
} from '@ibm-aiap/aiap--types-server';

import {
  ACA_ERROR_TYPE,
  formatIntoAcaError,
  throwAcaError,
} from '@ibm-aca/aca-utils-errors';

import {
  getMemoryStore,
} from '@ibm-aiap/aiap-memory-store-provider';

const { reloadOneByExternalId } = require('./reload-one-by-external-id');

export const findOneByExternalId = async (
  context: IContextV1,
  params: {
    externalId: any,
  }
) => {
  try {
    const EXTERNAL_ID = params?.externalId;
    if (
      lodash.isEmpty(EXTERNAL_ID)
    ) {
      const ERROR_MESSAGE = 'Missing required params.externalId attribute!';
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, ERROR_MESSAGE);
    }

    const MEMORY_STORE = getMemoryStore('tenant');
    let RET_VAL = await MEMORY_STORE.get(EXTERNAL_ID);
    if (
      lodash.isEmpty(RET_VAL)
    ) {
      RET_VAL = await reloadOneByExternalId(context, params);
    }
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(findOneByExternalId.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}
