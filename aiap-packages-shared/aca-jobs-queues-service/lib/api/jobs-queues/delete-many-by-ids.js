/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-jobs-queues-service-delete-many-by-ids';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const ramda = require('ramda');
const lodash = require('lodash');

const { getDatasourceByContext } = require('../datasource.utils');
const { formatIntoAcaError } = require('@ibm-aca/aca-utils-errors');
const { findOneById } = require('./find-one-by-id');

const {
  AIAP_EVENT_TYPE,
  getEventStreamByContext,
} = require('@ibm-aiap/aiap-event-stream-provider');

const removeQueueFromBoard = async (context, params) => {
  const PROMISES = [];
  const IDS = ramda.path(['ids'], params);
  if (!lodash.isArray(IDS) && IDS.length === 0) {
    return;
  }
  IDS.forEach(id => {
    const PARAMS = {
      id: id
    };
    PROMISES.push(findOneById(context, PARAMS));
  });
  const QUEUES = await Promise.all(PROMISES);
  QUEUES.forEach(queue => {
    getEventStreamByContext(context).publish(AIAP_EVENT_TYPE.DELETE_JOBS_QUEUE, { id: queue.id });
  });
  return;
}

const deleteManyByIds = async (context, params) => {
  try {
    const DATASOURCE = getDatasourceByContext(context);
    await removeQueueFromBoard(context, params);
    const RET_VAL = await DATASOURCE.jobsQueues.deleteManyByIds(context, params);
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error('->', { ACA_ERROR });
    throw ACA_ERROR;
  }
}

module.exports = {
  deleteManyByIds,
}
