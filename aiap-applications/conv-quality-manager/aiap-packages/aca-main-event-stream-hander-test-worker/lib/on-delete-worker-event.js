/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-main-event-stream-handler-on-delete-worker-event';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const lodash = require('@ibm-aca/aca-wrapper-lodash');
const ramda = require('@ibm-aca/aca-wrapper-ramda');

const { formatIntoAcaError, ACA_ERROR_TYPE, throwAcaError, appendDataToError } = require('@ibm-aca/aca-utils-errors');
const { destroyOne } = require('../../aca-test-worker-provider');

const onDeleteWorkerEvent = async (data, channel) => {
  const TENANT_ID = ramda.path(['tenant', 'id'], data);
  const WORKER_ID = ramda.path(['worker', 'id'], data);
  try {
    if (
      lodash.isEmpty(TENANT_ID)
    ) {
      const MESSAGE = `Missing required data.tenant.id parameter`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }
    if (
      lodash.isEmpty(WORKER_ID)
    ) {
      const MESSAGE = `Missing required data.worker.id parameter`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }
    await destroyOne(data);
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, { channel });
    logger.error(`${onDeleteWorkerEvent.name}`, { ACA_ERROR });
  }
}

module.exports = {
  onDeleteWorkerEvent,
}
