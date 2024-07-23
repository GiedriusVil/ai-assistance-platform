/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'enriched-by-lambda-module-async-executor';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const { ACA_ERROR_TYPE, throwAcaError, formatIntoAcaError, appendDataToError } = require('@ibm-aca/aca-utils-errors');
const { getTenantsCacheProvider } = require('@ibm-aiap/aiap-tenants-cache-provider');
const { executeEnrichedByLambdaModule } = require('@ibm-aca/aca-lambda-modules-executor');
const { getUpdateSessionContextAttribute } = require('@ibm-aiap/aiap-utils-soe-update');

const lodash = require('@ibm-aca/aca-wrapper-lodash');

const enrichedByLambdaModuleAsyncExecutor = async ({ moduleId, adapter, update, message, defaultExecutor }) => {
  let gAcaProps;
  let tenantCacheProvider;
  let tenant;
  let tenantId;
  let tenantHash;
  try {
    gAcaProps = getUpdateSessionContextAttribute(update, 'gAcaProps');
    if (
      lodash.isEmpty(gAcaProps)
    ) {
      const MESSAGE = 'Unable to retrieve gAcaProps from update!';
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, MESSAGE);
    }
    tenantCacheProvider = getTenantsCacheProvider();
    tenant = await tenantCacheProvider.tenants.findOneByGAcaProps({ gAcaProps });
    tenantId = tenant?.id;
    tenantHash = tenant?.hash;
    if (
      lodash.isEmpty(tenant)
    ) {
      const MESSAGE = 'Unable to retrieve tenant from tenantCacheProvider!';
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, MESSAGE);
    }
    const PARAMS = { adapter, update, tenant, message };
    const CONTEXT = {
      user: {
        session: { tenant }
      }
    };
    return await executeEnrichedByLambdaModule(moduleId, defaultExecutor, CONTEXT, PARAMS);
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, { tenantId, tenantHash });
    logger.error(enrichedByLambdaModuleAsyncExecutor.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

module.exports = {
  enrichedByLambdaModuleAsyncExecutor,
};
