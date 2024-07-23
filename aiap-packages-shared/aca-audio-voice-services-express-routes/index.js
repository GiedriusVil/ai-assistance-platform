/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-audio-voice-services-express-routes';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { throwAcaError, ACA_ERROR_TYPE, formatIntoAcaError } = require('@ibm-aca/aca-utils-errors');

const { authByJWTBearerStrategy, authByJWTQueryParamStrategy } = require('@ibm-aiap/aiap-passport-provider');

const routes = require('./lib/routes');
const audioVoiceServicesImportRoutes = require('./lib/routes-import');
const audioVoiceServicesExportRoutes = require('./lib/routes-export');

const { setConfigurationProvider } = require('./lib/configuration');

const initByConfigurationProvider = async (configurationProvider, app) => {
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

    app.use('/api/v1/audio-voice-services', authByJWTBearerStrategy({ session: false }), routes);
    app.use('/api/v1/audio-voice-services-import', authByJWTBearerStrategy({ session: false }), audioVoiceServicesImportRoutes);
    app.use('/api/v1/audio-voice-services-export', authByJWTQueryParamStrategy({ session: false }), audioVoiceServicesExportRoutes);
    logger.info('INITIALIZED');
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(`${initByConfigurationProvider.name}`, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

module.exports = {
  initByConfigurationProvider,
}
