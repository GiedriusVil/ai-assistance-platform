/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-test-worker-provider-registry';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const ramda = require('@ibm-aca/aca-wrapper-ramda');
const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { ACA_ERROR_TYPE, throwAcaError, formatIntoAcaError } = require('@ibm-aca/aca-utils-errors');

const REGISTRY = {};

const _ensureTenantRegistry = (id) => {
  const TENANT_REGISTRY = REGISTRY[id];
  if (
    !lodash.isObject(TENANT_REGISTRY)
  ) {
    REGISTRY[id] = {};
  }
}

const addOneToRegistry = (worker) => {
  try {
    const TENANT_ID = ramda.path(['tenantId'], worker);
    const WORKER_ID = ramda.path(['id'], worker);
    if (
      lodash.isEmpty(TENANT_ID)
    ) {
      const MESSAGE = `Missing required worker.tenantId paramter!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, MESSAGE);
    }
    if (
      lodash.isEmpty(WORKER_ID)
    ) {
      const MESSAGE = `Missing required worker.id paramter!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, MESSAGE);
    }
    _ensureTenantRegistry(TENANT_ID);
    const TENANT_REGISTRY = REGISTRY[TENANT_ID];
    TENANT_REGISTRY[`${WORKER_ID}`] = worker;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error('addOneToRegistry', { ACA_ERROR });
    throw ACA_ERROR;
  }
}

const removeOneFromRegistry = (worker) => {
  try {
    const TENANT_ID = ramda.path(['tenantId'], worker);
    const WORKER_ID = ramda.path(['id'], worker);
    if (
      lodash.isEmpty(TENANT_ID)
    ) {
      const MESSAGE = `Missing required worker.tenantId paramter!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, MESSAGE);
    }
    if (
      lodash.isEmpty(WORKER_ID)
    ) {
      const MESSAGE = `Missing required worker.id paramter!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, MESSAGE);
    }
    _ensureTenantRegistry(TENANT_ID);
    const TENANT_REGISTRY = REGISTRY[TENANT_ID];
    delete TENANT_REGISTRY[`${WORKER_ID}`];
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error('removeOneFromRegistry', { ACA_ERROR });
    throw ACA_ERROR;
  }
}

const addManyToRegistry = (workers) => {
  try {
    if (
      !lodash.isArray(workers)
    ) {
      const MESSAGE = 'Wrong parameter($workers) type! [Expected Array]';
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }
    for (let worker of workers) {
      addOneToRegistry(worker);
    }
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error('addManyToRegistry', { ACA_ERROR });
    throw ACA_ERROR;
  }
}

const getOneByTenantAndId = (params) => {
  try {
    const TENANT_ID = ramda.path(['tenant', 'id'], params);
    const WORKER_ID = ramda.path(['id'], params);
    if (
      lodash.isEmpty(TENANT_ID)
    ) {
      const MESSAGE = `Missing required params.tenant.id paramter!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, MESSAGE);
    }
    if (
      lodash.isEmpty(WORKER_ID)
    ) {
      const MESSAGE = `Missing required params.id paramter!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, MESSAGE);
    }
    const TENANT_REGISTRY = REGISTRY[TENANT_ID];
    const RET_VAL = ramda.path([`${WORKER_ID}`], TENANT_REGISTRY)
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error('getOneByIdAndHash', { ACA_ERROR });
    throw ACA_ERROR;
  }
}

const getRegistry = () => {
  return REGISTRY;
}

module.exports = {
  addOneToRegistry,
  addManyToRegistry,
  removeOneFromRegistry, 
  getOneByTenantAndId,
  getRegistry,
}
