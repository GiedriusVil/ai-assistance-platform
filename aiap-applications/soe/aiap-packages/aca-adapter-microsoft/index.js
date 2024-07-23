/*
   © Copyright IBM Corporation 2022. All Rights Reserved 
    
   SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-adapter-microsoft';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { throwAcaError, ACA_ERROR_TYPE, formatIntoAcaError } = require('@ibm-aca/aca-utils-errors');

const { MicrosoftAdapter } = require('./lib/microsoft-adapter');

const {
  setConfigurationProvider,
  getLibConfiguration,
} = require('./lib/configuration');
const {
  initMicrosoftCredentialsProvider,
  initGAcaPropsProvider
} = require('./lib/providers');

const initByConfigurationProvider = async (provider) => {
  try {
    if (
      lodash.isEmpty(provider)
    ) {
      const MESSAGE = `Missing required configuration provider! [aca-common-config || aca-lite-config]`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.INITIALIZATION_ERROR, MESSAGE);
    }
    setConfigurationProvider(provider);
    const PROVIDER_CONFIG = getLibConfiguration();
    initMicrosoftCredentialsProvider(PROVIDER_CONFIG);
    await initGAcaPropsProvider(PROVIDER_CONFIG);
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(MODULE_ID, { ACA_ERROR });
    throw ACA_ERROR;
  }

}

module.exports = {
  MicrosoftAdapter,
  initByConfigurationProvider,
}
