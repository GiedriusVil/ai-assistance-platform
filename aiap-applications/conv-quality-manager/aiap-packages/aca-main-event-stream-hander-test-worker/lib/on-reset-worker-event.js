/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-main-event-stream-handler-on-reset-worker-event';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const lodash = require('@ibm-aca/aca-wrapper-lodash');
const ramda = require('@ibm-aca/aca-wrapper-ramda');

const { formatIntoAcaError, ACA_ERROR_TYPE, throwAcaError, appendDataToError } = require('@ibm-aca/aca-utils-errors');
const { getAcaTestWorkerByTenantAndId, initOne } = require('@ibm-aca/aca-test-worker-provider');
const { getAcaTestCasesDatasourceByTenant } = require('@ibm-aca/aca-test-cases-datasource-provider');

const _resetWorker = async (tenant, workerDef) => {
  const TENANT_ID = ramda.path(['id'], tenant);
  const WORKER_ID = ramda.path(['id'], workerDef);
  try {
    if (
      lodash.isEmpty(TENANT_ID)
    ) {
      const MESSAGE = `Missing required tenant.id parameter!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }
    if (
      lodash.isEmpty(TENANT_ID)
    ) {
      const MESSAGE = `Missing required workerDef.id parameter!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }
    const WORKER_REQUEST = {
      tenant: tenant,
      id: WORKER_ID
    }
    const WORKER = getAcaTestWorkerByTenantAndId(WORKER_REQUEST);
    workerDef.tenantId = TENANT_ID;
    if (
      lodash.isEmpty(WORKER)
    ) {
      await initOne(workerDef);
    } else {
      await WORKER.reset(workerDef);
    }
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error('_resetWorker', { ACA_ERROR });
    ACA_ERROR.data = {
      tenant: { id: TENANT_ID },
      worker: { id: WORKER_ID },
    }
    throw ACA_ERROR;
  }
}

const onResetWorkerEvent = async (data, channel) => {
  try {
    const TENANT = ramda.path(['tenant'], data);
    const WORKER_ID = ramda.path(['worker', 'id'], data);
    const DATASOURCE = getAcaTestCasesDatasourceByTenant(TENANT);
    const WORKER_DEF = await DATASOURCE.workers.findOneById({ user: { id: 'system' } }, { id: WORKER_ID });
    if (
      !lodash.isEmpty(WORKER_DEF)
    ) {
      await _resetWorker(TENANT, WORKER_DEF);
    }
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, { channel });
    logger.error(`${onResetWorkerEvent.name}`, { ACA_ERROR });
  }
}

module.exports = {
  onResetWorkerEvent,
}
