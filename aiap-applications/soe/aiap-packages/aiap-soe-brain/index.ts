/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-soe-brain-index';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import lodash from '@ibm-aca/aca-wrapper-lodash';

import {
  ACA_ERROR_TYPE,
  formatIntoAcaError,
  throwAcaError,
} from '@ibm-aca/aca-utils-errors';

import {
  errorHandler,
} from './lib/error-handler';

import {
  AbstractMiddleware,
} from './lib/abstract-middleware';

import {
  botStates,
  middlewareTypes,
} from './lib/abstract-middleware/constants';

import {
  BrainStatus,
  BrainStatusHandler,
} from './lib/brain-status';

import {
  setConfigurationProvider,
} from './lib/configuration';


const initByConfigurationProvider = async (
  provider: any,
) => {
  try {
    if (
      lodash.isEmpty(provider)
    ) {
      const MESSAGE = `Missing required configuration provider! [aca-lite-config]`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.INITIALIZATION_ERROR, MESSAGE);
    }
    setConfigurationProvider(provider);
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(initByConfigurationProvider.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

export {
  initByConfigurationProvider,
  AbstractMiddleware,
  errorHandler,
  //
  botStates,
  middlewareTypes,
  //
  BrainStatus,
  BrainStatusHandler,
};
