/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-test-cases-service-test-workers-save-one';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const ramda = require('@ibm-aca/aca-wrapper-ramda');
const lodash = require('@ibm-aca/aca-wrapper-lodash');

const {
  AIAP_EVENT_TYPE,
  getEventStreamMain,
} = require('@ibm-aiap/aiap-event-stream-provider');

const {
  ACA_ERROR_TYPE,
  formatIntoAcaError,
  throwAcaError,
} = require('@ibm-aca/aca-utils-errors');

const { getDatasourceByContext } = require('../datasource.utils');

const _emitResetTestWorkerEvent = async (context, workerDef) => {
  const TENANT = ramda.path(['user', 'session', 'tenant'], context);
  const TENANT_ID = ramda.path(['id'], TENANT);
  const WORKER_ID = ramda.path(['id'], workerDef);
  try {
    if (
      lodash.isEmpty(TENANT_ID)
    ) {
      const MESSAGE = 'Missing required context.user.session.tenant.id parameter!';
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }
    if (
      lodash.isEmpty(WORKER_ID)
    ) {
      const MESSAGE = 'Missing required workerDef.id parameter!';
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }
    const RESET_TEST_WORKER_EVENT = {
      tenant: TENANT,
      worker: { id: WORKER_ID }
    };
    const MAIN_EVENT_STREAM = getEventStreamMain();
    await MAIN_EVENT_STREAM.publish(AIAP_EVENT_TYPE.RESET_TEST_WORKER, RESET_TEST_WORKER_EVENT);
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error('_emitResetTestWorkerEvent', { ACA_ERROR });
    ACA_ERROR.data = {
      tenant: { id: TENANT_ID },
      worker: { id: WORKER_ID },
    }
    throw ACA_ERROR
  }
}

const saveOne = async (context, params) => {
  try {
    const DATASOURCE = getDatasourceByContext(context);
    const RET_VAL = await DATASOURCE.workers.saveOne(context, params);
    await _emitResetTestWorkerEvent(context, RET_VAL);
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(saveOne.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
};

module.exports = {
  saveOne,
}
