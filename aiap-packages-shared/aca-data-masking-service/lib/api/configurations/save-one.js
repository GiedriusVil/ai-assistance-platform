/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-data-masking-service-configurations-save-one';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { formatIntoAcaError, throwAcaError, ACA_ERROR_TYPE } = require('@ibm-aca/aca-utils-errors');
const { getDatasourceByContext } = require('../datasource.utils');

const {
  AIAP_EVENT_TYPE,
  getEventStreamMain,
  getEventStreamByContext,
} = require('@ibm-aiap/aiap-event-stream-provider');

const { appendAuditInfo } = require('@ibm-aiap/aiap-utils-audit');

const _publishMaskingConfigurationSaveEvent = (configuration, context) => {
  const MAIN_EVENT_STREAM = getEventStreamMain();
  if (
    lodash.isEmpty(MAIN_EVENT_STREAM)
  ) {
    const MESSAGE = 'Unable to retrieve main-aca-event-stream!';
    throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, MESSAGE);
  }
  const EVENT = {
    ...configuration
  };
  const EVENT_STREAM_BY_CONTEXT = getEventStreamByContext(context);
  EVENT_STREAM_BY_CONTEXT.publish(AIAP_EVENT_TYPE.SAVE_DATA_MASKING_CONFIGURATION, EVENT);
}

const saveOne = async (context, params) => {
  let maskingConfig;
  try {
    const DATASOURCE = getDatasourceByContext(context);
    maskingConfig = params?.maskingConfig;
    appendAuditInfo(context, maskingConfig);
    const RET_VAL = await DATASOURCE.dataMaskingConfigurations.saveOne(context, params);
    _publishMaskingConfigurationSaveEvent(RET_VAL, context);
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error('->', { ACA_ERROR });
    throw ACA_ERROR;
  }
};

module.exports = {
  saveOne,
}
