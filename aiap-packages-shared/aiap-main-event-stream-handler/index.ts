/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'main-stream-event-handler-index';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import lodash from '@ibm-aca/aca-wrapper-lodash';

import {
  ACA_ERROR_TYPE,
  formatIntoAcaError,
  throwAcaError,
} from '@ibm-aca/aca-utils-errors';

import {
  setConfigurationProvider,
} from './lib/configuration';

import {
  subscribe,
} from './lib';

const initByConfigurationProvider = async (
  provider: any,
) => {
  try {
    if (
      lodash.isEmpty(provider)
    ) {
      const MESSAGE = 'Missing configuration provider!';
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.INITIALIZATION_ERROR, MESSAGE);
    }
    setConfigurationProvider(provider);
    const PARAMS = {};
    await subscribe(PARAMS);
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(initByConfigurationProvider.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

export {
  initByConfigurationProvider,
} 
