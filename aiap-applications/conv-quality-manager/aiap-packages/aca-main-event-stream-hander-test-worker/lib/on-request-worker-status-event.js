/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-main-event-stream-handler-on-request-worker-status-event';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const lodash = require('@ibm-aca/aca-wrapper-lodash');
const ramda = require('@ibm-aca/aca-wrapper-ramda');

const {
  formatIntoAcaError,
  ACA_ERROR_TYPE,
  throwAcaError,
  appendDataToError,
} = require('@ibm-aca/aca-utils-errors');

const {
  AIAP_EVENT_TYPE,
  getEventStreamMain,
} = require('@ibm-aiap/aiap-event-stream-provider');

const { getAcaTestWorkerByTenantAndId } = require('@ibm-aca/aca-test-worker-provider');

const onRequestWorkerStatusEvent = async (data, channel) => {
  try {
    const EVENT_ID = ramda.path(['event', 'id'], data);
    const TENANT_ID = ramda.path(['tenant', 'id'], data);
    const WORKER_ID = ramda.path(['worker', 'id'], data);

    const MAIN_EVENT_STREAM = getEventStreamMain();
    if (
      lodash.isEmpty(MAIN_EVENT_STREAM)
    ) {
      const MESSAGE = `Unable to retrieve MAIN_EVENT_STREAM`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, MESSAGE);
    }
    const WORKER_REQUEST = {
      id: WORKER_ID,
      tenant: {
        id: TENANT_ID,
      }
    }
    const WORKER = getAcaTestWorkerByTenantAndId(WORKER_REQUEST);
    const WORKER_STATUS = {
      tenant: {
        id: TENANT_ID
      },
      worker: {
        id: WORKER_ID,
        status: ramda.path(['status'], WORKER),
        statusMessage: ramda.path(['statusMessage'], WORKER),
      }
    }
    logger.info('onRequestWorkerStatusEvent', {
      event: { id: EVENT_ID },
      workerStatus: WORKER_STATUS
    });
    MAIN_EVENT_STREAM.publish(`${AIAP_EVENT_TYPE.TEST_WORKER_STATUS}:${EVENT_ID}`, WORKER_STATUS);
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, { channel });
    logger.error(`${onRequestWorkerStatusEvent.name}`, { ACA_ERROR });
  }
}

module.exports = {
  onRequestWorkerStatusEvent,
}
