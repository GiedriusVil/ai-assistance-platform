/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'main-stream-event-handler-lib-index';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import lodash from '@ibm-aca/aca-wrapper-lodash';

import {
  ACA_ERROR_TYPE,
  formatIntoAcaError,
  throwAcaError,
} from '@ibm-aca/aca-utils-errors';

import {
  getLibConfiguration,
} from './configuration';

const subscribeByHandler = async (
  params: {
    handler: {
      name: any,
      method: any,
    }
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
    await HANDLER_METHOD(params);
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(subscribeByHandler.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

export const subscribe = async (
  params: any,
) => {
  try {
    const CONFIGURATION_LIB = getLibConfiguration();
    const CONFIGURATION_HANDLERS = CONFIGURATION_LIB?.handlers;
    if (
      lodash.isArray(CONFIGURATION_HANDLERS) &&
      !lodash.isEmpty(CONFIGURATION_HANDLERS)
    ) {
      const PROMISES = [];
      for (const CONFIGURATION_HANDLER of CONFIGURATION_HANDLERS) {
        const PARAMS = { ...params, handler: CONFIGURATION_HANDLER };
        PROMISES.push(subscribeByHandler(PARAMS));
      }
      await Promise.all(PROMISES);
    }
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(subscribe.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}
