/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-conversation-insights-workers-init-and-run';
require('@ibm-aca/aca-common-logger').init({}, { name: MODULE_ID }); //Default logger initialization without config
const { workerData, parentPort } = require('worker_threads');

const configurationProvider = require('@ibm-aiap/aiap-tenant-customizer-configuration');

const ramda = require('@ibm-aca/aca-wrapper-ramda');
const { formatIntoAcaError } = require('@ibm-aca/aca-utils-errors');

const initAndRun = async () => {
  const CONFIG = await configurationProvider.loadConfiguration();
  const LOGGER_OPTIONS = {
    name: MODULE_ID,
  };
  require('@ibm-aca/aca-common-logger').init(CONFIG, LOGGER_OPTIONS);
  const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

  process.on('unhandledRejection', (reason, promise) => {
    const ACA_ERROR = {
      type: 'UNHANDLED_REJECTION',
      readon: reason,
      promise: promise
    };
    logger.error('WORKER->', { ACA_ERROR });
    throw ACA_ERROR;
  });

  require('@ibm-aiap/aiap-jwt-provider').initByConfigurationProvider(configurationProvider);

  await require('@ibm-aiap/aiap-tenants-resources-loader').initByConfigurationProvider(configurationProvider);

  await require('@ibm-aiap/aiap-mongo-client-provider').initByConfigurationProvider(configurationProvider);
  await require('@ibm-aiap/aiap-redis-client-provider').initByConfigurationProvider(configurationProvider);

  await require('@ibm-aiap/aiap-memory-store-provider').initByConfigurationProvider(configurationProvider);

  await require('@ibm-aiap/aiap-event-stream-provider').initByConfigurationProvider(configurationProvider);

  await require('@ibm-aiap/aiap-app-datasource-provider').initByConfigurationProvider(configurationProvider);
  await require('@ibm-aiap/aiap-app-service').initByConfigurationProvider(configurationProvider);

  await require('@ibm-aca/aca-audit-service').initByConfigurationProvider(configurationProvider);

  await require('@ibm-aiap/aiap-ai-services-service').initByConfigurationProvider(configurationProvider);
  await require('@ibm-aiap/aiap-ai-services-datasource-provider').initByConfigurationProvider(configurationProvider);

  await require('@ibm-aca/aca-answers-datasource-provider').initByConfigurationProvider(configurationProvider);
  await require('@ibm-aca/aca-answers-service').initByConfigurationProvider(configurationProvider);

  await require('@ibm-aca/aca-conversations-datasource-provider').initByConfigurationProvider(configurationProvider);
  await require('@ibm-aca/aca-conversations-service').initByConfigurationProvider(configurationProvider);

  await require('@ibm-aca/aca-analytics-live-datasource-provider').initByConfigurationProvider(configurationProvider);
  await require('@ibm-aca/aca-analytics-live-service').initByConfigurationProvider(configurationProvider);

  await require('@ibm-aca/aca-data-masking-datasource-provider').initByConfigurationProvider(configurationProvider);
  await require('@ibm-aca/aca-data-masking-service').initByConfigurationProvider(configurationProvider);

  await require('@ibm-aca/aca-classification-catalog-datasource-provider').initByConfigurationProvider(configurationProvider);
  await require('@ibm-aca/aca-jobs-queues-datasource-provider').initByConfigurationProvider(configurationProvider);
  await require('@ibm-aca/aca-classification-catalog-service').initByConfigurationProvider(configurationProvider);
  await require('@ibm-aca/aca-jobs-queues-service').initByConfigurationProvider(configurationProvider);

  await require('@ibm-aca/aca-auditor-datasource-provider').initByConfigurationProvider(configurationProvider);
  await require('@ibm-aca/aca-auditor-service').initByConfigurationProvider(configurationProvider);

  await require('@ibm-aiap/aiap-lambda-modules-datasource-provider').initByConfigurationProvider(configurationProvider);
  await require('@ibm-aiap/aiap-lambda-modules-service').initByConfigurationProvider(configurationProvider);
  await require('@ibm-aca/aca-lambda-modules-executor').initByConfigurationProvider(configurationProvider);

  await require('@ibm-aiap/aiap-engagements-datasource-provider').initByConfigurationProvider(configurationProvider);
  await require('@ibm-aiap/aiap-engagements-service').initByConfigurationProvider(configurationProvider);

  await require('@ibm-aiap/aiap-main-event-stream-handler').initByConfigurationProvider(configurationProvider);
  await require('@ibm-aiap/aiap-tenant-event-stream-handler').initByConfigurationProvider(configurationProvider);

  await require('@ibm-aca/aca-worker-pool-manager-provider').initByConfigurationProvider(configurationProvider);
  await require('@ibm-aca/aca-jobs-queue-provider').initByConfigurationProvider(configurationProvider);

  await require('@ibm-aca/aca-classifier-datasource-provider').initByConfigurationProvider(configurationProvider);
  await require('@ibm-aca/aca-classifier-service').initByConfigurationProvider(configurationProvider);

  await require('@ibm-aiap/aiap-tenants-cache-provider').initByConfigurationProvider(configurationProvider);


  const { getAcaAiTestExecutor } = require('@ibm-aca/aca-ai-test-executor');

  const ACA_AI_TEST_EXECUTOR = getAcaAiTestExecutor();
  const CONTEXT = ramda.path(['context'], workerData);
  const PARAMS = ramda.path(['params'], workerData);
  const RESPONSE = await ACA_AI_TEST_EXECUTOR.tests.executeOne(CONTEXT, PARAMS);
  parentPort.postMessage(RESPONSE);
  process.exit();
}


try {
  initAndRun();
} catch (error) {
  const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
  throw ACA_ERROR;
}
