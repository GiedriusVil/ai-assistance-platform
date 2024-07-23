/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-surgeon-express-routes-datasources-retrieve-many';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { formatIntoAcaError } = require('@ibm-aca/aca-utils-errors');

const { constructActionContextFromRequest } = require('@ibm-aiap/aiap-utils-express-routes');

const { getAcaConversationsDatasources } = require('@ibm-aca/aca-conversations-datasource-provider');
const { getAcaAnalyticsLiveDatasources } = require('@ibm-aca/aca-analytics-live-datasource-provider');
const { getAiServicesDatasources } = require('@ibm-aiap/aiap-ai-services-datasource-provider');
const { getAcaAnswersDatasources } = require('@ibm-aca/aca-answers-datasource-provider');
const { getLambdaModulesDatasources } = require('@ibm-aiap/aiap-lambda-modules-datasource-provider');
const { getEngagementsDatasources } = require('@ibm-aiap/aiap-engagements-datasource-provider');
const { getAcaAuditorDatasources } = require('@ibm-aca/aca-auditor-datasource-provider');
const { getAcaClassificationCatalogDatasources } = require('@ibm-aca/aca-classification-catalog-datasource-provider');
const { getAcaJobsQueuesDatasources } = require('@ibm-aca/aca-jobs-queues-datasource-provider');
const { getAcaClassifierDatasources } = require('@ibm-aca/aca-classifier-datasource-provider');

const { getAcaOrganizationsDatasources } = require('@ibm-aca/aca-organizations-datasource-provider');
const { getAcaRulesDatasources } = require('@ibm-aca/aca-rules-datasource-provider');

const { sanitizeRegistry } = require('../../utils');

const retrieveMany = async (request, response) => {
  const ERRORS = [];
  const CONTEXT = constructActionContextFromRequest(request);
  const RESULT = {};
  try {
    const DATASOURCES_CONVERSATIONS = getAcaConversationsDatasources(CONTEXT);
    const DATASOURCES_ANALYTICS_LIVE = getAcaAnalyticsLiveDatasources(CONTEXT);
    const DATASOURCES_AI_SERVICES = getAiServicesDatasources(CONTEXT);
    const DATASOURCES_ANSWERS = getAcaAnswersDatasources(CONTEXT);
    const DATASOURCES_LAMBDA_MODULES = getLambdaModulesDatasources(CONTEXT);
    const DATASOURCES_ENGAGEMENTS = getEngagementsDatasources(CONTEXT);
    const DATASOURCES_AUDITOR = getAcaAuditorDatasources(CONTEXT);
    const DATASOURCES_CLASSIFICATION_CATALOG = getAcaClassificationCatalogDatasources(CONTEXT);
    const DATASOURCES_JOBS_QUEUES = getAcaJobsQueuesDatasources(CONTEXT);
    const DATASOURCES_CLASSIFIER = getAcaClassifierDatasources(CONTEXT);
    const DATASOURCES_ORGANIZATIONS = getAcaOrganizationsDatasources(CONTEXT);
    const DATASOURCES_RULES = getAcaRulesDatasources(CONTEXT);

    RESULT.conversations = sanitizeRegistry(DATASOURCES_CONVERSATIONS);
    RESULT.analyticsLive = sanitizeRegistry(DATASOURCES_ANALYTICS_LIVE);
    RESULT.aiServices = sanitizeRegistry(DATASOURCES_AI_SERVICES);
    RESULT.answers = sanitizeRegistry(DATASOURCES_ANSWERS);
    RESULT.lambdaModules = sanitizeRegistry(DATASOURCES_LAMBDA_MODULES);
    RESULT.engagements = sanitizeRegistry(DATASOURCES_ENGAGEMENTS);
    RESULT.auditor = sanitizeRegistry(DATASOURCES_AUDITOR);
    RESULT.classificationCatalogs = sanitizeRegistry(DATASOURCES_CLASSIFICATION_CATALOG);
    RESULT.jobsQueues = sanitizeRegistry(DATASOURCES_JOBS_QUEUES);
    RESULT.classifier = sanitizeRegistry(DATASOURCES_CLASSIFIER);
    RESULT.organizations = sanitizeRegistry(DATASOURCES_ORGANIZATIONS);
    RESULT.rules = sanitizeRegistry(DATASOURCES_RULES);

  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    ERRORS.push(ACA_ERROR);
  }
  if (lodash.isEmpty(ERRORS)) {
    response.status(200).json(RESULT);
  } else {
    logger.error(retrieveMany.name, { ERRORS });
    response.status(500).json({ errors: ERRORS });
  }
};

module.exports = {
  retrieveMany,
};
