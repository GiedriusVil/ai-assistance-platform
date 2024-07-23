/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = `tenant-event-stream-handler-index`;
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const lodash = require('@ibm-aca/aca-wrapper-lodash');

import {
  ACA_ERROR_TYPE,
  formatIntoAcaError,
  throwAcaError,
} from '@ibm-aca/aca-utils-errors';

import {
  getEventStreamByTenant,
} from '@ibm-aiap/aiap-event-stream-provider';

import {
  createAcaTenantEventStreamHandler,
} from './lib/handler-factory';

import {
  addOneToRegistry,
  getRegistry,
} from './lib/handler-registry';

import {
  setConfigurationProvider,
} from './lib/configuration';

const initOneByTenant = async (
  params: {
    tenant: any,
  },
) => {
  const TENANT = params?.tenant;

  try {
    if (
      lodash.isEmpty(TENANT)
    ) {
      const MESSAGE = `Missing required params.tenant parameter!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }
    const TENANT_EVENT_STREAM = getEventStreamByTenant(TENANT);
    if (
      !lodash.isEmpty(TENANT_EVENT_STREAM)
    ) {
      const TENANT_EVENT_STREAM_HANDLER = createAcaTenantEventStreamHandler(TENANT);
      await addOneToRegistry(TENANT_EVENT_STREAM_HANDLER);
    } else {
      logger.warn('TENANT_IS_MISSING_EVENT_STREAM');
    }
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(initOneByTenant.name, { ACA_ERROR });
  }
}

const initByConfigurationProvider = async (
  provider: any,
) => {
  try {
    if (
      lodash.isEmpty(provider)
    ) {
      const ERROR_MESSAGE = 'Missing configuration provider!';
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.INITIALIZATION_ERROR, ERROR_MESSAGE);
    }
    setConfigurationProvider(provider);
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(initByConfigurationProvider.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

const getTenantEventStreamHandlers = () => {
  const RET_VAL = getRegistry();
  return RET_VAL;
}

export {
  initOneByTenant,
  getTenantEventStreamHandlers,
  initByConfigurationProvider
}
