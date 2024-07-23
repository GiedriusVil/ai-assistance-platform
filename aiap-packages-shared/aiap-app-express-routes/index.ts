/*
   © Copyright IBM Corporation 2022. All Rights Reserved 
    
   SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'app-express-routes-index';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import lodash from '@ibm-aca/aca-wrapper-lodash';

import {
  ACA_ERROR_TYPE,
  formatIntoAcaError,
  throwAcaError,
} from '@ibm-aca/aca-utils-errors';

import {
  authByJWTBearerStrategy,
  authByJWTQueryParamStrategy,
} from '@ibm-aiap/aiap-passport-provider';

import {
  setConfigurationProvider,
} from './lib/configuration';

import {
  routes as appRoutes,
} from './lib/routes';

import {
  routes as appExportRoutes,
} from './lib/routes-export';

import {
  routes as appImportRoutes,
} from './lib/routes-import';

const initByConfigurationProvider = async (
  provider: any,
  app: any,
) => {
  try {
    if (
      lodash.isEmpty(provider)
    ) {
      const ERROR_MESSAGE = `Missing required configuration provider! [aca-common-config || aca-lite-config]`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, ERROR_MESSAGE);
    }
    if (
      lodash.isEmpty(app)
    ) {
      const ERROR_MESSAGE = `Missing required app parameter!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, ERROR_MESSAGE);
    }
    setConfigurationProvider(provider);

    app.use('/api/v1/app', authByJWTBearerStrategy({ session: false }), appRoutes);
    app.use('/api/v1/app-import', authByJWTBearerStrategy({ session: false }), appImportRoutes);
    app.use('/api/v1/app-export', authByJWTQueryParamStrategy({ session: false }), appExportRoutes);

    logger.info('INITIALIZED');
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(initByConfigurationProvider.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}


export {
  initByConfigurationProvider,
}
