/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'tenants-event-stream-handler-live-analytics-queries-save-event';
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
  loadOneByRefAndTenant,
} from '@ibm-aca/aca-live-analytics-queries-executor';

export const QuerySaveEventHandler = (
  tenant: ITenantV1,
) => {
  try {
    if (
      lodash.isEmpty(tenant)
    ) {
      const ERROR_MESSAGE = `Missing required tenant parameter!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, ERROR_MESSAGE);
    }
    const HANDLER = async (data, channel) => {
      const PARAMS = {
        ref: data?.ref,
        tenant: tenant
      }
      logger.info(`${QuerySaveEventHandler.name}-handler`, { data, channel });
      await loadOneByRefAndTenant(PARAMS);
    };
    return HANDLER;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(QuerySaveEventHandler.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}
