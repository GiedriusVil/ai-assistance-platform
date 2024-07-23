/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-jobs-queues-service-save-one';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);
const ramda = require('ramda');
const lodash = require('lodash');

const { getDatasourceByContext } = require('../datasource.utils');
const { formatIntoAcaError } = require('@ibm-aca/aca-utils-errors');

const { appendAuditInfo } = require('@ibm-aiap/aiap-utils-audit');

const {
  AIAP_EVENT_TYPE,
  getEventStreamByContext,
} = require('@ibm-aiap/aiap-event-stream-provider');

const saveOne = async (context, params) => {
  try {
    const DATASOURCE = getDatasourceByContext(context);
    appendAuditInfo(context, params?.jobsQueues);
    const JOBS_QUEUE = ramda.path(['jobsQueues'], params); // TODO
    const QUEUE_ID = ramda.path(['id'], JOBS_QUEUE);
    const RESULT = await DATASOURCE.jobsQueues.saveOne(context, params);
    getEventStreamByContext(context).publish(AIAP_EVENT_TYPE.RESET_JOBS_QUEUE, { id: QUEUE_ID });
    return RESULT;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error('->', { ACA_ERROR });
    throw ACA_ERROR;
  }
}

module.exports = {
  saveOne,
}
