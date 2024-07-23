/*
   © Copyright IBM Corporation 2022. All Rights Reserved 
    
   SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-conversations-express-routes';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const lodash = require('lodash');

const { formatIntoAcaError, ACA_ERROR_TYPE, throwAcaError } = require('@ibm-aca/aca-utils-errors');

const { authByJWTBearerStrategy } = require('@ibm-aiap/aiap-passport-provider');

const { setConfigurationProvider } = require('./lib/configuration');

const { router } = require('./lib/router');

const initByConfigurationProvider = async (provider, app) => {
  try {
    if (
      lodash.isEmpty(provider)
    ) {
      const MESSAGE = 'Missing required provider parameter!';
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.INITIALIZATION_ERROR, MESSAGE);
    }
    if (
      lodash.isEmpty(app)
    ) {
      const MESSAGE = 'Missing required app paramater!';
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.INITIALIZATION_ERROR, MESSAGE);
    }
    setConfigurationProvider(provider);

    app.use('/api/v1/conversations', authByJWTBearerStrategy({ session: false }), router);

    logger.info('INITIALIZED');
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error('->', { ACA_ERROR });
    throw ACA_ERROR;
  }
}


module.exports = {
  initByConfigurationProvider,
}
