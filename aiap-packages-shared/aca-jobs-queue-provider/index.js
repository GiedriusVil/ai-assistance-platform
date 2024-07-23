/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = `${require('./package.json').name}-index`;
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const ramda = require('ramda');
const lodash = require('lodash');

const { transformToAcaErrorFormat } = require('@ibm-aca/aca-data-transformer');

const { getStorage, deleteOneByIdAndTenant, loadOneByIdAndTenant, loadManyByTenant, ensureQueuesStorage, getOneByIdAndTenant } = require('./lib/runtime-storage');

const { setConfigurationProvider } = require('./lib/configuration');

const { AcaJobsQueueBullMq } = require('./lib/jobs-queue-bullmq');


const QUEUE_TYPES = {
  BULLMQ: 'BULLMQ'
};


const initializeAcaJobsQueueBullMq = async (config, tenant) => {
  try {
    const QUEUE = new AcaJobsQueueBullMq(config, tenant);
    await QUEUE.initialize();
    const TENANT_ID = QUEUE.tenantId;
    ensureQueuesStorage(TENANT_ID);
    const ID = QUEUE.id;
    const STORAGE = getStorage();
    const QUEUES_CONTAINER = ramda.path([TENANT_ID], STORAGE);
    QUEUES_CONTAINER[ID] = QUEUE;
    const RET_VAL = QUEUE;
    return RET_VAL;
  } catch (error) {
    const ACA_ERRROR = transformToAcaErrorFormat(MODULE_ID, error);
    logger.error('->', { ACA_ERRROR });
    throw ACA_ERRROR;
  }
}

const initManyByTenant = async (params) => {
  const TENANT = ramda.path(['tenant'], params);
  const PARAMS = {
    tenant: TENANT
  };
  const QUEUES_DEF = await loadManyByTenant(PARAMS, true);
  const TENANT_ID = ramda.path(['id'], TENANT);
  if (
    lodash.isArray(QUEUES_DEF) &&
    !lodash.isEmpty(QUEUES_DEF)
  ) {
    const PROMISES = [];
    for (let queueDef of QUEUES_DEF) {
      const QUEUE_TYPE = ramda.path(['type'], queueDef);
      switch (QUEUE_TYPE) {
        case QUEUE_TYPES.BULLMQ:
          PROMISES.push(initializeAcaJobsQueueBullMq(queueDef, TENANT));
          break;
        default:
          break;
      }
    }
    await Promise.all(PROMISES);
    logger.info(`Initialized queues for tenantId: ${TENANT_ID}`);
  } else {
    logger.warn('Configuration is missing - skipping initialization!');
  }
}

const initOneByTenant = async (params) => {
  const TENANT = ramda.path(['tenant'], params);
  const QUEUE_DEF = await loadOneByIdAndTenant(params);
  const PARAMS = {
    tenant: TENANT,
    queue: QUEUE_DEF,
  };
  const INITIALISED_QUEUE = getOneByIdAndTenant(PARAMS);
  let isNew = true;
  if (
    !lodash.isEmpty(INITIALISED_QUEUE)
  ) {
    isNew = false;
  }

  if (!isNew) {
    deleteOneByIdAndTenant(PARAMS);
  }

  if (
    !lodash.isEmpty(QUEUE_DEF)
  ) {
    let RESULT;
    const QUEUE_TYPE = ramda.path(['type'], QUEUE_DEF);
    switch (QUEUE_TYPE) {
      case QUEUE_TYPES.BULLMQ:
        RESULT = await initializeAcaJobsQueueBullMq(QUEUE_DEF, TENANT);
        break;
      default:
        break;
    }
    logger.info('Initialized -> ', { QUEUE_DEF });
    return RESULT;
  }
}

const initByConfigurationProvider = async (provider) => {
  if (
    lodash.isEmpty(provider)
  ) {
    const ACA_ERROR = {
      type: 'INITIALIZATION_ERROR',
      message: `[${MODULE_ID}] Missing required provider parameter!`
    };
    throw ACA_ERROR;
  }
  setConfigurationProvider(provider);
}

const getManyByTenantId = (tenantId) => {
  const RET_VAL = [];
  const STORAGE = getStorage();
  const QUEUES_CONTAINER = STORAGE[tenantId];
  if (
    !lodash.isEmpty(QUEUES_CONTAINER)
  ) {
    const QUEUE_KEYS = Object.keys(QUEUES_CONTAINER);
    if (
      !lodash.isEmpty(QUEUE_KEYS) &&
      lodash.isArray(QUEUE_KEYS)
    ) {
      for (let key of QUEUE_KEYS) {
        let queue = QUEUES_CONTAINER[key];
        if (
          !lodash.isEmpty(queue)
        ) {
          RET_VAL.push(queue);
        }
      }
    }
  }
  const COMPARE = (a, b) => {
    if (a.name < b.name) {
      return -1;
    }
    if (a.name > b.name) {
      return 1;
    }
    return 0;
  }

  RET_VAL.sort(COMPARE);
  return RET_VAL;
}



module.exports = {
  initManyByTenant,
  loadManyByTenant,
  initByConfigurationProvider,
  getManyByTenantId,
  initOneByTenant,
  deleteOneByIdAndTenant,
  loadOneByIdAndTenant,
  getOneByIdAndTenant,
}
