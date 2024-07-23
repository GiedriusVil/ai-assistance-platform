/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-test-cases-service-test-workers-find-many-by-query';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const ramda = require('@ibm-aca/aca-wrapper-ramda');
const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { v4: uuidv4 } = require('uuid');

const { formatIntoAcaError } = require('@ibm-aca/aca-utils-errors');

const {
  AIAP_EVENT_TYPE,
  getEventStreamMain,
} = require('@ibm-aiap/aiap-event-stream-provider');

const { getDatasourceByContext } = require('../datasource.utils');

const _sleep = (ms) => {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

const _uploadWorkerStatus = async (context, worker) => {
  let removeListener;
  try {
    const EVENT_ID = uuidv4();
    const TENANT_ID = ramda.path(['user', 'session', 'tenant', 'id'], context);
    const WORKER_ID = ramda.path(['id'], worker);

    const MAIN_EVENT_STREAM = getEventStreamMain();
    worker.instances = [];
    const HANDLER = async (data, channel) => {
      try {
        logger.info('_uploadWorkerStatus', { data, channel });
        worker.instances.push(data);
      } catch (error) {
        const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
        logger.error('_uploadWorkerStatus:handler', { ACA_ERROR });
      }
    }
    removeListener = await MAIN_EVENT_STREAM.subscribe(`${AIAP_EVENT_TYPE.TEST_WORKER_STATUS}:${EVENT_ID}`, HANDLER);
    const REQUEST_WORKER_STATUS = {
      event: { id: EVENT_ID },
      tenant: { id: TENANT_ID },
      worker: { id: WORKER_ID },
    }
    await MAIN_EVENT_STREAM.publish(AIAP_EVENT_TYPE.REQUEST_TEST_WORKER_STATUS, REQUEST_WORKER_STATUS);
    await _sleep(1500);
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error('_uploadWorkerStatus', { ACA_ERROR });
    throw ACA_ERROR;
  } finally {
    if (
      lodash.isFunction(removeListener)
    ) {
      await removeListener();
    }
  }
}

const _uploadWorkersStatus = async (context, workers) => {
  try {
    const PROMISES = [];
    if (
      lodash.isArray(workers)
    ) {
      for (let worker of workers) {
        PROMISES.push(_uploadWorkerStatus(context, worker));
      }
    }
    await Promise.all(PROMISES);
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error('_uploadWorkersStatus', { ACA_ERROR });
    throw ACA_ERROR;
  }
}

const findManyByQuery = async (context, params) => {
  try {
    const DATASOURCE = getDatasourceByContext(context);
    const RET_VAL = await DATASOURCE.workers.findManyByQuery(context, params);
    const WORKERS = ramda.path(['items'], RET_VAL);
    await _uploadWorkersStatus(context, WORKERS);
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error('->', { ACA_ERROR });
    throw ACA_ERROR;
  }
}

module.exports = {
  findManyByQuery,
}
