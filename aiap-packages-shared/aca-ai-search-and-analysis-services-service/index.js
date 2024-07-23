/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = `aca-ai-search-and-analysis-services-service-index`;
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const lodash = require('@ibm-aca/aca-wrapper-lodash');
const ramda = require('@ibm-aca/aca-wrapper-ramda');

const { formatIntoAcaError, throwAcaError, ACA_ERROR_TYPE } = require('@ibm-aca/aca-utils-errors');
const { setConfigurationProvider } = require('./lib/configuration');

const {
  aiSearchAndAnalysisServicesService,
  aiSearchAndAnalysisProjectsService,
  aiSearchAndAnalysisCollectionsService,
  aiSearchAndAnalysisDocumentsService,
} = require('./lib/api');

const initByConfigurationProvider = async (provider) => {
  try {
    if (
      lodash.isEmpty(provider)
    ) {
      const MESSAGE = `Missing required configuration provider! [aca-common-config || aca-lite-config]`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.INITIALIZATION_ERROR, MESSAGE);
    }
    setConfigurationProvider(provider);
    logger.info('INITIALIZED');
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(`${initByConfigurationProvider.name}`, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

module.exports = {
  initByConfigurationProvider,
  aiSearchAndAnalysisServicesService,
  aiSearchAndAnalysisProjectsService,
  aiSearchAndAnalysisCollectionsService,
  aiSearchAndAnalysisDocumentsService,
}
