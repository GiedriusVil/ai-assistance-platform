/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'main-event-stream-handler-on-tenant-save-event';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import lodash from '@ibm-aca/aca-wrapper-lodash';

import {
  ITenantV1,
} from '@ibm-aiap/aiap--types-domain-app';

import {
  ACA_ERROR_TYPE,
  formatIntoAcaError,
  throwAcaError,
} from '@ibm-aca/aca-utils-errors';

import {
  reloadOne,
} from '@ibm-aiap/aiap-tenants-resources-loader';

export const onTenantSaveEvent = async (
  tenant: ITenantV1,
  channel: any,
) => {
  const TENANT_ID = tenant?.id;
  const TENANT_HASH = tenant?.hash;
  try {
    if (
      lodash.isEmpty(TENANT_ID)
    ) {
      const ERROR_MESSAGE = `Missing required tenant.id parameter!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, ERROR_MESSAGE);
    }
    if (
      lodash.isEmpty(TENANT_HASH)
    ) {
      const ERROR_MESSAGE = `Missing required tenant.hash parameter!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, ERROR_MESSAGE);
    }
    await reloadOne(tenant);
    logger.info(`Tenant has been reloaded into cash!`, {
      tenant: {
        id: TENANT_ID,
        hash: TENANT_HASH
      },
      channel: channel
    });
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    ACA_ERROR.tenant = { id: TENANT_ID, hash: TENANT_HASH };
    ACA_ERROR.channel = channel;
    logger.error(onTenantSaveEvent.name, { ACA_ERROR });
  }
}
