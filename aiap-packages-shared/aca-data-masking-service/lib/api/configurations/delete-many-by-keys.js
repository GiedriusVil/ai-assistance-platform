/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-data-masking-service-configurations-delete-many-by-ids';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const lodash = require('@ibm-aca/aca-wrapper-lodash');

const {
  ACA_ERROR_TYPE,
  formatIntoAcaError,
  throwAcaError,
} = require('@ibm-aca/aca-utils-errors');

const {
  AIAP_EVENT_TYPE,
  getEventStreamByContext,
  getEventStreamMain,
} = require('@ibm-aiap/aiap-event-stream-provider');

const { getDatasourceByContext } = require('../datasource.utils');

const _publishMaskingConfigurationDeleteEvent = (key, context) => {
  const MAIN_EVENT_STREAM = getEventStreamMain();
  if (
    lodash.isEmpty(MAIN_EVENT_STREAM)
  ) {
    const MESSAGE = 'Unable to retrieve main-aca-event-stream!';
    throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, MESSAGE)
  }
  const EVENT = {
    key
  };
  const EVENT_STREAM_BY_CONTEXT = getEventStreamByContext(context)
  EVENT_STREAM_BY_CONTEXT.publish(AIAP_EVENT_TYPE.DELETE_DATA_MASKING_CONFIGURATION, EVENT);
}

const deleteManyByKeys = async (context, params) => {
  try {
    const DATASOURCE = getDatasourceByContext(context);
    const RET_VAL = await DATASOURCE.dataMaskingConfigurations.deleteManyByKeys(context, params);
    for (let key of params.keys) {
      _publishMaskingConfigurationDeleteEvent(key, context);
    }
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error('->', { ACA_ERROR });
    throw ACA_ERROR;
  }
};

module.exports = {
  deleteManyByKeys,
}
