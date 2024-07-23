/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = `tenant-event-stream-handler-registry`;
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import lodash from '@ibm-aca/aca-wrapper-lodash';

import {
  ACA_ERROR_TYPE,
  formatIntoAcaError,
  throwAcaError,
} from '@ibm-aca/aca-utils-errors';

import {
  TenantEventStreamHandlerV1,
} from '../handler';


const REGISTRY = {};

const _ensureTenantRegistryExistance = (
  tenantId: any,
) => {
  const REGISTRY_TENANT = REGISTRY[tenantId];
  if (
    lodash.isEmpty(REGISTRY_TENANT)
  ) {
    REGISTRY[tenantId] = {};
  }
}

const _addOneToTenantRegistry = async (
  registry: any,
  handler: TenantEventStreamHandlerV1,
) => {
  const HANDLER_ID = handler?.id;

  // SCHEDULE_OTHER_TENANT_EVENT_STREAM_HANDLERS_DESTROY!

  registry[HANDLER_ID] = handler;
  await handler.subscribe();
}

const addOneToRegistry = async (
  handler: TenantEventStreamHandlerV1,
) => {
  try {
    const TENANT_ID = handler?.tenantId;

    const EVENT_STREAM_ID = handler?.eventStreamId;
    const EVENT_STREAM_HASH = handler?.eventStreamHash;
    if (
      lodash.isEmpty(TENANT_ID)
    ) {
      const ERROR_MESSAGE = `Missing required handler.tenantId attribute!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, ERROR_MESSAGE);
    }
    if (
      lodash.isEmpty(EVENT_STREAM_ID)
    ) {
      const ERROR_MESSAGE = `Missing required handler.eventStreamId attribute!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, ERROR_MESSAGE);
    }
    if (
      lodash.isEmpty(EVENT_STREAM_HASH)
    ) {
      const ERROR_MESSAGE = `Missing required handler.eventStreamHash attribute!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, ERROR_MESSAGE);
    }
    _ensureTenantRegistryExistance(TENANT_ID);
    const TENANT_REGISTRY = REGISTRY[TENANT_ID];
    await _addOneToTenantRegistry(TENANT_REGISTRY, handler);
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(addOneToRegistry.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

const getRegistry = () => {
  const RET_VAL = REGISTRY;
  return RET_VAL;
}

export {
  addOneToRegistry,
  getRegistry,
}
