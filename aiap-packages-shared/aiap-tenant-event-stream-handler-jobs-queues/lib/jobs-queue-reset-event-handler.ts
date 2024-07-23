/*
   © Copyright IBM Corporation 2022. All Rights Reserved 
    
   SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'tenants-event-stream-handler-on-jobs-queue-reset-event';
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
  initOneByTenant as initQueueByTenant,
} from '@ibm-aca/aca-jobs-queue-provider';

const {
  getOneByTenantId: getBoardByTenantId
} = require('@ibm-aca/aca-jobs-queue-board-provider');

export const JobsQueuesResetEventHandler = (
  tenant: ITenantV1,
) => {
  try {
    if (
      lodash.isEmpty(tenant)
    ) {
      const ERROR_MESSAGE = `Missing required tenant parameter!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, ERROR_MESSAGE);
    }
    const HANDLER = async (
      data: any,
      channel: any,
    ) => {
      try {
        const PARAMS = {
          id: data?.id,
          tenant: tenant
        }
        const TENANT_ID = tenant?.id;
        const QUEUE = await initQueueByTenant(PARAMS);
        const BOARD = getBoardByTenantId({ tenantId: TENANT_ID });
        if (
          lodash.isEmpty(BOARD)
        ) {
          const MESSAGE = `Unable to retrieve BOARD!`;
          throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, MESSAGE);
        }
        BOARD.addQueue(QUEUE);
      } catch (error) {
        const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
        logger.error(`${JobsQueuesResetEventHandler.name}-handler`, { ACA_ERROR });
        throw ACA_ERROR;
      }
    };
    return HANDLER;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(JobsQueuesResetEventHandler.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}
