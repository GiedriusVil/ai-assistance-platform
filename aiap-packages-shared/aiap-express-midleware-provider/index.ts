/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'express-midleware-provider';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import lodash from '@ibm-aca/aca-wrapper-lodash';

import {
  setConfigurationProvider,
} from './lib/configuration';

const initByConfigurationProvider = async (
  provider: any,
) => {
  if (
    lodash.isEmpty(provider)
  ) {
    const ACA_ERROR = {
      type: 'INITIALIZATION_ERROR',
      message: `[${MODULE_ID}] Missing required configuration provider!`
    };
    logger.error(initByConfigurationProvider.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
  setConfigurationProvider(provider);
}

import {
  basicAuthenicationMidleware,
  allowIfHasConfigurationPermission,
  formidableMiddlewareWrapper,
  oauth2TokenAccessAuthenticationMidleware,
} from './lib/midleware';

export {
  initByConfigurationProvider,
  basicAuthenicationMidleware,
  allowIfHasConfigurationPermission,
  formidableMiddlewareWrapper,
  oauth2TokenAccessAuthenticationMidleware,
}

