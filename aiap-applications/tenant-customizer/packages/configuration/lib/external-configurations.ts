/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = `aiap-tenant-customizer-configuration-external-configuration`;

import {
  ACA_ERROR_TYPE,
  formatIntoAcaError,
  throwAcaError,
} from '@ibm-aca/aca-utils-errors';

const PATH_TO_CONFIGURATION = '/lib/configuration';
const PATH_TO_DIST_CONFIGURATION = '/dist/lib/configuration';

const EXTERNAL_LIBRARIES_LIST = [
  '@ibm-aiap/aiap-express-session-provider',
  '@ibm-aiap/aiap-passport-provider',
  '@ibm-aiap/aiap-mongo-client-provider',
  '@ibm-aiap/aiap-redis-client-provider',
  '@ibm-aiap/aiap-memory-store-provider',
  '@ibm-aiap/aiap-app-datasource-provider',
  '@ibm-aiap/aiap-tenants-cache-provider',
  '@ibm-aiap/aiap-tenants-resources-loader',
  '@ibm-aca/aca-answers-datasource-provider',
  '@ibm-aca/aca-answers-service',
  '@ibm-aca/aca-conversations-datasource-provider',
  '@ibm-aiap/aiap-conv-shadow-datasource-provider',
  '@ibm-aca/aca-analytics-live-datasource-provider',
  '@ibm-aiap/aiap-ai-services-datasource-provider',
  '@ibm-aiap/aiap-ai-services-service',
  '@ibm-aca/aca-audio-voice-services-datasource-provider',
  '@ibm-aca/aca-audio-voice-services-service',
  '@ibm-aiap/aiap-jwt-provider',
  '@ibm-aca/aca-classification-catalog-datasource-provider',
  '@ibm-aca/aca-classification-catalog-service',
  '@ibm-aca/aca-jobs-queues-datasource-provider',
  '@ibm-aiap/aiap-event-stream-provider',
  '@ibm-aiap/aiap-tenant-event-stream-handler',
  '@ibm-aiap/aiap-lambda-modules-datasource-provider',
  '@ibm-aca/aca-auditor-datasource-provider',
  '@ibm-aca/aca-worker-pool-manager-provider',
  '@ibm-aca/aca-jobs-queue-provider',
  '@ibm-aca/aca-jobs-queue-board-provider',
  '@ibm-aiap/aiap-engagements-datasource-provider',
  '@ibm-aiap/aiap-engagements-service',
  '@ibm-aiap/aiap-lambda-modules-service',
  '@ibm-aiap/aiap-main-event-stream-handler',
  '@ibm-aca/aca-classifier-datasource-provider',
  '@ibm-aca/aca-classifier-service',
  '@ibm-aiap/aiap-app-service',
  '@ibm-aca/aca-lambda-modules-executor',
  '@ibm-aca/aca-data-masking-datasource-provider',
  '@ibm-aiap/aiap-ai-translation-services-datasource-provider',
  '@ibm-aiap/aiap-ibm-secrets-manager-client-provider',
  '@ibm-aca/aca-ai-search-and-analysis-services-datasource-provider',
  '@ibm-aiap/aiap-object-storage-datasource-provider',
  '@ibm-aiap/aiap-object-storage-service',
];


const requireExternalLibConfiguration = (name) => {
  let requirePath;
  let retVal;
  if (
    !name
  ) {
    const ERROR_MESSAGE = `Missing required name parameter!`;
    throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, ERROR_MESSAGE);
  }
  try {
    requirePath = `${name}${PATH_TO_CONFIGURATION}`;
    retVal = require(requirePath);
  } catch (error) {
    console.log(`[${MODULE_ID}] Unable require configuration!`, {
      requirePath,
      errorCode: error?.code,
    });
    if (
      error?.code === 'MODULE_NOT_FOUND'
    ) {
      requirePath = `${name}${PATH_TO_DIST_CONFIGURATION}`;
      console.log(`[${MODULE_ID}] Will try dist path!`, { requirePath });
      retVal = require(requirePath);
    } else {
      throw error;
    }
  }
  return retVal;
}

const attachEternalLibsSchema = (schema, library) => {
  try {
    if (
      !schema
    ) {
      const ERROR_MESSAGE = `Missing required schema parameter!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.INITIALIZATION_ERROR, ERROR_MESSAGE);
    }
    const EXTERNAL_CONFIGURATION = requireExternalLibConfiguration(library);
    const RET_VAL = EXTERNAL_CONFIGURATION.Configurator.attachToJoiSchema(schema);
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    throw ACA_ERROR;
  }
}

const attachEternalLibsSchemas = (schema) => {
  for (const EXTERNAL_LIBRARY of EXTERNAL_LIBRARIES_LIST) {
    schema = attachEternalLibsSchema(schema, EXTERNAL_LIBRARY);
  }
  return schema;
}

const loadExternalLibConfiguration = async (
  rootConfiguration,
  rawConfiguration,
  configurationProvider,
  library,
) => {
  try {
    if (
      !rootConfiguration
    ) {
      const ERROR_MESSAGE = `Missing required rootConfiguration parameter!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.INITIALIZATION_ERROR, ERROR_MESSAGE);
    }
    if (
      !rawConfiguration
    ) {
      const ERROR_MESSAGE = `Missing required rawConfiguration parameter!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.INITIALIZATION_ERROR, ERROR_MESSAGE);
    }
    if (
      !configurationProvider
    ) {
      const ERROR_MESSAGE = `Missing required configurationProvider parameter!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.INITIALIZATION_ERROR, ERROR_MESSAGE);
    }
    const EXTERNAL_CONFIGURATION = requireExternalLibConfiguration(library);
    EXTERNAL_CONFIGURATION.Configurator.loadConfiguration(rootConfiguration, rawConfiguration, configurationProvider);
    const RET_VAL = await EXTERNAL_CONFIGURATION.Configurator.loadConfiguration(rootConfiguration, rawConfiguration, configurationProvider);
    return RET_VAL;
  } catch (error) {
    console.log(MODULE_ID, { error });
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    console.log(MODULE_ID, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

const loadExternalLibsConfiguration = async (rootConfiguration, rawConfiguration, configurationProvider) => {
  try {
    const PROMISES = [];
    for (const EXTERNAL_LIBRARY of EXTERNAL_LIBRARIES_LIST) {
      PROMISES.push(loadExternalLibConfiguration(
        rootConfiguration,
        rawConfiguration,
        configurationProvider,
        EXTERNAL_LIBRARY,
      ));
    }
    await Promise.all(PROMISES);
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    console.log(MODULE_ID, { ACA_ERROR });
  }
}

export {
  attachEternalLibsSchemas,
  loadExternalLibsConfiguration,
}
