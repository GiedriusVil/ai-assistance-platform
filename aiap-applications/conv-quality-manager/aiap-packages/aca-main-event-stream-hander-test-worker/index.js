/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-main-event-stream-handler-test-worker-index';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { ACA_ERROR_TYPE, throwAcaError, formatIntoAcaError } = require('@ibm-aca/aca-utils-errors');

const EVENT_STREAM_LIB_NAME = '@ibm-aiap/aiap-event-stream-provider';
const { getEventStreamMain, AIAP_EVENT_TYPE } = require(EVENT_STREAM_LIB_NAME);

const { onRequestWorkerStatusEvent } = require('./lib/on-request-worker-status-event');
const { onResetWorkerEvent } = require('./lib/on-reset-worker-event');
const { onDeleteWorkerEvent } = require('./lib/on-delete-worker-event');

const subscribe = async (params = {}) => {
  try {
    const MAIN_EVENT_STREAM = getEventStreamMain();
    if (
      lodash.isEmpty(MAIN_EVENT_STREAM)
    ) {
      const MESSAGE = `Unable to retrieve main-aca-event-stream from ${EVENT_STREAM_LIB_NAME}!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, MESSAGE, { params });
    }
    await MAIN_EVENT_STREAM.subscribe(AIAP_EVENT_TYPE.REQUEST_TEST_WORKER_STATUS, onRequestWorkerStatusEvent);
    await MAIN_EVENT_STREAM.subscribe(AIAP_EVENT_TYPE.RESET_TEST_WORKER, onResetWorkerEvent);
    await MAIN_EVENT_STREAM.subscribe(AIAP_EVENT_TYPE.DELETE_TEST_WORKER, onDeleteWorkerEvent);
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error('subscribe', { ACA_ERROR });
    throw ACA_ERROR;
  }
}

module.exports = {
  subscribe,
}
