/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-engagements-express-routes-index';
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
  allowIfHasPagesPermissions,
} from '@ibm-aiap/aiap-user-session-provider';

import * as routes from './lib/routes';
import * as routesExport from './lib/routes-export';
import * as routesImport from './lib/routes-import';

const initByConfigurationProvider = async (
  configurationProvider: any,
  app: any
) => {
  try {
    if (
      lodash.isEmpty(configurationProvider)
    ) {
      const MESSAGE = `Missing required configuration provider parameter! [aca-common-config || aca-lite-config]`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.INITIALIZATION_ERROR, MESSAGE);
    }
    if (
      lodash.isEmpty(app)
    ) {
      const MESSAGE = `Missing required app parameter!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, MESSAGE);
    }
    setConfigurationProvider(configurationProvider);

    app.use(
      '/api/v1/engagements',
      authByJWTBearerStrategy({ session: false }),
      routes.routes
    );
    app.use(
      '/api/v1/engagements-import',
      authByJWTBearerStrategy({ session: false }),
      allowIfHasPagesPermissions('EngagementsViewV1'),
      routesImport.routes
    );
    app.use(
      '/api/v1/engagements-export',
      authByJWTQueryParamStrategy({ session: false }),
      allowIfHasPagesPermissions('EngagementsViewV1'),
      routesExport.routes
    );
    logger.info('INITIALIZED');
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(`${initByConfigurationProvider.name}`, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

export {
  initByConfigurationProvider,
}
