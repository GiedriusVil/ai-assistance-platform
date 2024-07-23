/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = `tenant-event-stream-handler`;
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import ramda from '@ibm-aca/aca-wrapper-ramda';
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
  getEventStreamByTenant,
} from '@ibm-aiap/aiap-event-stream-provider';

import {
  getLibConfiguration,
} from '../configuration';

export class TenantEventStreamHandlerV1 {

  tenant: ITenantV1;
  tenantId: any;

  eventStream: any;
  eventStreamId: any;
  eventStreamHash: any;

  id: any;

  removeListeners: Array<any> = [];

  constructor(
    tenant: ITenantV1,
  ) {
    try {
      this.tenant = tenant;
      this.tenantId = tenant?.id;
      if (
        lodash.isEmpty(this.tenantId)
      ) {
        const MESSAGE = `Missing required tenant.id parameter!`;
        throwAcaError(MODULE_ID, ACA_ERROR_TYPE.INITIALIZATION_ERROR, MESSAGE);
      }

      this.eventStream = getEventStreamByTenant(tenant);
      if (
        lodash.isEmpty(this.eventStream)
      ) {
        const MESSAGE = `Tenant is missing event stream configuration!`;
        throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE, { tenant });
      }
      this.eventStreamId = ramda.path(['id'], this.eventStream);
      this.eventStreamHash = ramda.path(['hash'], this.eventStream);
      this.id = `${this.eventStreamId}:${this.eventStreamHash}`;

      this.removeListeners = [];
    } catch (error) {
      const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
      logger.error('constructor', { ACA_ERROR });
      throw ACA_ERROR;
    }
  }

  subscribeByHandler = async (
    params: {
      handler: {
        name: any,
        method: any,
      },
    },
  ) => {
    try {
      const HANDLER_NAME = params?.handler?.name;
      const HANDLER_METHOD_NAME = params?.handler?.method;
      if (
        lodash.isEmpty(HANDLER_NAME)
      ) {
        const MESSAGE = 'Missing required params.handler.name parameter!'
        throwAcaError(MODULE_ID, ACA_ERROR_TYPE.INITIALIZATION_ERROR, MESSAGE);
      }
      if (
        lodash.isEmpty(HANDLER_METHOD_NAME)
      ) {
        const MESSAGE = 'Missing required params.handler.method parameter!'
        throwAcaError(MODULE_ID, ACA_ERROR_TYPE.INITIALIZATION_ERROR, MESSAGE);
      }
      const HANDLER = require(HANDLER_NAME);
      if (
        lodash.isEmpty(HANDLER)
      ) {
        const MESSAGE = `Please add handler library to runtime -> ${HANDLER_NAME}`;
        throwAcaError(MODULE_ID, ACA_ERROR_TYPE.INITIALIZATION_ERROR, MESSAGE);
      }
      const HANDLER_METHOD = HANDLER[HANDLER_METHOD_NAME];
      if (
        !lodash.isFunction(HANDLER_METHOD)
      ) {
        const MESSAGE = `Wrong type of handler library subscription method! Must be function!`;
        throwAcaError(MODULE_ID, ACA_ERROR_TYPE.INITIALIZATION_ERROR, MESSAGE);
      }
      await HANDLER_METHOD({ tenant: this.tenant, handlers: params });
    } catch (error) {
      const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
      logger.error(this.subscribeByHandler.name, { ACA_ERROR });
      throw ACA_ERROR;
    }
  }

  subscribe = async (
    params?: any,
  ) => {
    try {
      const CONFIGURATION_LIB = getLibConfiguration();
      const CONFIGURATION_HANDLERS = ramda.path(['handlers'], CONFIGURATION_LIB);
      if (
        lodash.isArray(CONFIGURATION_HANDLERS) &&
        !lodash.isEmpty(CONFIGURATION_HANDLERS)
      ) {
        const PROMISES = [];
        for (const CONFIGURATION_HANDLER of CONFIGURATION_HANDLERS) {
          const PARAMS = { ...params, handler: CONFIGURATION_HANDLER };
          PROMISES.push(this.subscribeByHandler(PARAMS));
        }
        await Promise.all(PROMISES);
      }
    } catch (error) {
      const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
      logger.error(this.subscribe.name, { ACA_ERROR });
      throw ACA_ERROR;
    }
  }

  unsubscribe = async () => {
    for (const removeListener of this.removeListeners) {
      removeListener();
    }
  }
}
