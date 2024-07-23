/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-lambda-modules-executor-utils-error-logger';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const ramda = require('ramda');
const lodash = require('lodash');

const { formatIntoAcaError } = require('@ibm-aca/aca-utils-errors');
const { getTenantsCacheProvider } = require('@ibm-aiap/aiap-tenants-cache-provider');
const { getAcaAuditorDatasourceByTenant } = require('../../index');

const logErrorToDatabase = async (params, lambdaModule, error) => {
  try {
    const G_ACA_PROPS = ramda.path(['update', 'raw', 'gAcaProps'], params);
    const LAMBDA_MODULE_ID = ramda.path(['id'], lambdaModule);

    const TENANTS_CACHE_PROVIDER = getTenantsCacheProvider();

    const TENANT = await TENANTS_CACHE_PROVIDER.tenants.findOneByGAcaProps({ gAcaProps: G_ACA_PROPS });
    const AUDITOR_DATASOURCE = getAcaAuditorDatasourceByTenant(TENANT);

    const AUDITOR_RECORD = {
      action: 'MODULE_EXECUTION',
      moduleId: LAMBDA_MODULE_ID,
      module: lambdaModule,
      error: error,
      context: G_ACA_PROPS,
      timestamp: new Date(),
    };
    const RET_VAL = await AUDITOR_DATASOURCE.lambdaModulesErrors.saveOne({}, { record: AUDITOR_RECORD });
    logger.info(`[${MODULE_ID}] Lambda module error logged into database! ->`, RET_VAL);
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error('->', { ACA_ERROR });
    throw ACA_ERROR;
  }
}

module.exports = {
  logErrorToDatabase,
}
