/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-test-cases-service-test-workers-delete-many-by-ids';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const ramda = require('@ibm-aca/aca-wrapper-ramda');
const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { formatIntoAcaError } = require('@ibm-aca/aca-utils-errors');
const { getDatasourceByContext } = require('../datasource.utils');

const {
  AIAP_EVENT_TYPE,
  getEventStreamMain,
} = require('@ibm-aiap/aiap-event-stream-provider');

const _emitDeleteEvents = async (context, params) => {
  const IDS = ramda.path(['ids'], params);
  const TENANT = ramda.path(['user', 'session', 'tenant'], context);
  try {
    const MAIN_EVENT_STREAM = getEventStreamMain();
    if (
      lodash.isArray(IDS) &&
      !lodash.isEmpty(MAIN_EVENT_STREAM)
    ) {
      for (let id of IDS) {
        if (
          !lodash.isEmpty(id)
        ) {
          const DATA = {
            tenant: TENANT,
            worker: { id }
          };
          MAIN_EVENT_STREAM.publish(AIAP_EVENT_TYPE.DELETE_TEST_WORKER, DATA);
        }
      }
    }
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error('->', { ACA_ERROR });
    throw ACA_ERROR
  }
}

const deleteManyByIds = async (context, params) => {
  try {
    const DATASOURCE = getDatasourceByContext(context);
    const RET_VAL = await DATASOURCE.workers.deleteManyByIds(context, params);
    await _emitDeleteEvents(context, RET_VAL);
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error('->', { ACA_ERROR });
    throw ACA_ERROR;
  }
};

module.exports = {
  deleteManyByIds,
}
