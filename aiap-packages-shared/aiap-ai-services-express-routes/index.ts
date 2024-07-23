/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-ai-services-express-routes-index';
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
  allowIfHasPagesPermissions,
  overideSessionTenantByHeaderWare,
} from '@ibm-aiap/aiap-user-session-provider';

import * as routes from './lib/routes';
import * as routesExport from './lib/routes-export';
import * as routesImport from './lib/routes-import';

import {
  setConfigurationProvider,
} from './lib/configuration';

const initByConfigurationProvider = async (
  configurationProvider: any,
  app: any,
) => {
  try {
    setConfigurationProvider(configurationProvider);
    if (
      lodash.isEmpty(app)
    ) {
      const MESSAGE = 'Missing required app paramater!';
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }
    app.use(
      '/api/v1/ai/export',
      authByJWTQueryParamStrategy({ session: false }),
      overideSessionTenantByHeaderWare,
      allowIfHasPagesPermissions('AiServicesViewV1'),
      routesExport.routes
    );
    app.use(
      '/api/v1/ai/import',
      authByJWTBearerStrategy({ session: false }),
      overideSessionTenantByHeaderWare,
      allowIfHasPagesPermissions('AiServicesViewV1'),
      routesImport.routes
    );
    app.use(
      '/api/v1/ai',
      authByJWTBearerStrategy({ session: false }),
      overideSessionTenantByHeaderWare,
      allowIfHasPagesPermissions('AiServicesViewV1'),
      routes.routes
    );
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
