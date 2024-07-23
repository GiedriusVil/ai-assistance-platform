/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'tenants-memory-store-find-one-by-external-id';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import ramda from '@ibm-aca/aca-wrapper-ramda';
import lodash from '@ibm-aca/aca-wrapper-lodash';

import {
  IContextV1,
} from '@ibm-aiap/aiap--types-server';

import {
  ACA_ERROR_TYPE,
  appendDataToError,
  formatIntoAcaError,
  throwAcaError,
} from '@ibm-aca/aca-utils-errors';

import {
  getDatasourceV1App,
} from '@ibm-aiap/aiap-app-datasource-provider';

import {
  getMemoryStore,
} from '@ibm-aiap/aiap-memory-store-provider';

import {
  getConfiguration,
} from '../../configuration';

const getExpirationInterval = async () => {
  const CONFIGURATION = getConfiguration();
  const CONFIGURATION_STORES = CONFIGURATION?.memoryStoreProvider?.stores;
  const CONFIGURATION_STORE = lodash.find(CONFIGURATION_STORES, store => store.name == 'tenant');
  const RET_VAL = CONFIGURATION_STORE?.expiration;
  return RET_VAL;
}

export const reloadOneByExternalId = async (
  context: IContextV1,
  params: {
    externalId: any,
  },
) => {
  const EXTERNAL_ID = params?.externalId;

  try {

    if (
      lodash.isEmpty(EXTERNAL_ID)
    ) {
      const ERROR_MESSAGE = `Missing required params.externalId parameter!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, ERROR_MESSAGE);
    }
    const MEMORY_STORE = getMemoryStore('tenant');
    const DATASOURCE = getDatasourceV1App();
    const TENANT = await DATASOURCE.tenants.findOneByExternalId(context, { externalId: EXTERNAL_ID });

    const expirationInterval = await getExpirationInterval();
    logger.info('Expiration interval for tenants', { expirationInterval });

    MEMORY_STORE.set(EXTERNAL_ID, TENANT, expirationInterval);
    return TENANT;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, { EXTERNAL_ID })
    logger.error(reloadOneByExternalId.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}
