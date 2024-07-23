/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-test-worker-provider-index';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const ramda = require('@ibm-aca/aca-wrapper-ramda');
const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { formatIntoAcaError, throwAcaError, ACA_ERROR_TYPE } = require('@ibm-aca/aca-utils-errors');
const { getAcaTestCasesDatasourceByTenant } = require('@ibm-aca/aca-test-cases-datasource-provider');

const { setConfigurationProvider } = require('./lib/configuration');
const { createAcaTestWorkers, createAcaTestWorker } = require('./lib/worker-factory');
const { addManyToRegistry, getOneByTenantAndId, addOneToRegistry, removeOneFromRegistry } = require('./lib/worker-registry');

const initByConfigurationProvider = async (provider) => {
  try {
    if (
      lodash.isEmpty(provider)
    ) {
      const MESSAGE = `Please provide configuration provider! [aca-common-config, aca-lite-config]`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, MESSAGE);
    }
    setConfigurationProvider(provider);
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(`${initByConfigurationProvider.name}`, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

const initManyByTenant = async (tenant) => {
  try {
    const DATASOURCE = getAcaTestCasesDatasourceByTenant(tenant);
    if (
      !lodash.isEmpty(DATASOURCE)
    ) {
      const WORKERS_DEFAULT_QUERY = {
        pagination: {
          page: 1,
          size: 1000,
        }
      };
      const WORKERS_QUERY_RESULT = await DATASOURCE.workers.findManyByQuery({}, WORKERS_DEFAULT_QUERY);
      const WORKERS_DEFS = ramda.pathOr([], ['items'], WORKERS_QUERY_RESULT);
      const WORKERS_DEFS_WITH_TENANT_ID = WORKERS_DEFS.map((item) => {
        item.tenantId = tenant.id;
        return item;
      });
      const WORKERS = await createAcaTestWorkers(WORKERS_DEFS_WITH_TENANT_ID);
      addManyToRegistry(WORKERS);
    }
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(`${initManyByTenant.name}`, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

const initOne = async (workerDef) => {
  try {
    const WORKER = await createAcaTestWorker(workerDef);
    await addOneToRegistry(WORKER);

  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(`${initOne.name}`, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

const destroyOne = async (params) => {
  const TENANT = ramda.path(['tenant'], params);
  const TENANT_ID = ramda.path(['id'], TENANT);
  const WORKER_ID = ramda.path(['worker', 'id'], params);
  try {
    if (
      lodash.isEmpty(TENANT_ID)
    ) {
      const MESSAGE = `Missing required params.tenant.id parameter`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }
    if (
      lodash.isEmpty(WORKER_ID)
    ) {
      const MESSAGE = `Missing required params.worker.id parameter`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }
    const GET_WORKER_REQUEST = {
      tenant: TENANT,
      id: WORKER_ID,
    }
    const WORKER = getOneByTenantAndId(GET_WORKER_REQUEST);
    if (
      !lodash.isEmpty(WORKER) &&
      lodash.isFunction(WORKER.destroy)
    ) {
      removeOneFromRegistry(WORKER);
      await WORKER.destroy();
    }
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(`${destroyOne.name}`, { ACA_ERROR });
  }
}

module.exports = {
  initByConfigurationProvider,
  initManyByTenant,
  initOne,
  destroyOne,
  getAcaTestWorkerByTenantAndId: getOneByTenantAndId,
}
