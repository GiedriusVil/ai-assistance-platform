/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const logger = require('@ibm-aca/aca-common-logger')('aca-rules-engine-express-routes');

const { contextMidleware } = require('./lib/middlware');
const { engineV1Routes } = require('./lib/routes');

const { setConfigurationProvider } = require('./lib/configuration');


const initByConfigurationProvider = async (configurationProvider, app) => {
  setConfigurationProvider(configurationProvider);
  if (!app) {
    throw new Error('Provide express application!');
  }

  app.use('/api/engine', contextMidleware,  engineV1Routes);
  logger.info('INITIALIZED');
}

module.exports = {
  initByConfigurationProvider,
}
