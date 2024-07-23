/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-test-worker-provider-worker-factory';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const ramda = require('@ibm-aca/aca-wrapper-ramda');
const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { ACA_ERROR_TYPE, throwAcaError, formatIntoAcaError } = require('@ibm-aca/aca-utils-errors');

const { AcaTestWorkerBotium } = require('../worker-botium');

const { getConfiguration, Configurator } = require('../configuration');


let workers;

const allocateSlot = () => {
  if (
    !lodash.isArray(workers)
  ) {
    const LIB_CONFIG = ramda.path([Configurator.NAME], getConfiguration());
    workers = new Array(LIB_CONFIG.maxWorkersCount);
  }
  const RET_VAL = workers.findIndex((wp) => !wp);

  workers[RET_VAL] = 'allocated';

  return RET_VAL;
}

const _createBotiumWorker = async (definition) => {
  try {
    const RET_VAL = new AcaTestWorkerBotium(definition);
    await RET_VAL.initialize();
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error('_createBotiumWorker', { ACA_ERROR });
    throw ACA_ERROR;
  }
}

const createAcaTestWorker = async (definition) => {
  try {
    const SLOT = allocateSlot();
    if (SLOT < 0) {
      const MESSAGE = 'All worker slots are used! Increase maxWorkerCount!';
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, MESSAGE)
    }
    if (
      lodash.isEmpty(definition)
    ) {
      const MESSAGE = 'Worker definition is empty!';
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }
    if (
      !lodash.isObject(definition)
    ) {
      const MESSAGE = 'Wront worker definition type. Must be object!';
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }
    definition.slot = SLOT;
    // 2021-12-17 [LEGO] - We will have to think about worker type here!
    const RET_VAL = await _createBotiumWorker(definition);
    workers[SLOT] = RET_VAL;
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error('createAcaTestWorker', { ACA_ERROR });
    throw ACA_ERROR;
  }
}

const createAcaTestWorkers = async (definitions) => {
  try {
    if (
      !lodash.isArray(definitions)
    ) {
      const MESSAGE = 'Wrong type of provided parameter definitions! [Expected: Array]';
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, MESSAGE, { definitions });
    }
    const PROMISES = definitions.map((definition) => {
      return createAcaTestWorker(definition);
    });
    const RET_VAL = await Promise.all(PROMISES);
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error('createAcaTestWorkers', { ACA_ERROR });
    throw ACA_ERROR;
  }
}

const destroyAcaTestWorker = async (worker) => {
  try {
    if (
      lodash.isEmpty(worker)
    ) {
      const MESSAGE = 'Missing required worker parameter!';
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }
    await worker.destroy();
    const SLOT = workers.findIndex((wp) => wp === worker);
    workers[SLOT] = null;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error('destroyAcaTestWorker', { ACA_ERROR });
    throw ACA_ERROR;
  }
}

module.exports = {
  createAcaTestWorkers,
  createAcaTestWorker,
  destroyAcaTestWorker,
}
