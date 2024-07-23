
/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-chat-server-session-provider-slack-session-provider-health-check';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const ramda = require('@ibm-aca/aca-wrapper-ramda');
const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { formatIntoAcaError, appendDataToError } = require('@ibm-aca/aca-utils-errors');
const { HEALTH_CHECK_TYPES } = require('./health-check-types');

const { identifySlackMessageType } = require('./identify-slack-message-type');
const { isHealthCheckMessage } = require('./is-health-check-message');

const { processHealthCheckConfiguration } = require('./process-health-check-configuration');
const { processHealthCheckHelp } = require('./process-health-check-help');
const { processHealthCheckMirror } = require('./process-health-check-mirror');
const { processHealthCheckPing } = require('./process-health-check-ping');
const { processHealthCheckUserSessionDelete } = require('./process-health-check-user-session-delete');
const { processHealthCheckUserSessionView } = require('./process-health-check-user-session-view');

const processHealthCheckMessage = async (params) => {
  let healthCheckType;
  try {
    healthCheckType = identifySlackMessageType(params);
    switch (healthCheckType) {
      case HEALTH_CHECK_TYPES.CONFIGURATION:
        await processHealthCheckConfiguration(params);
        break;
      case HEALTH_CHECK_TYPES.HELP:
        await processHealthCheckHelp(params);
        break;
      case HEALTH_CHECK_TYPES.MIRROR:
        await processHealthCheckMirror(params);
        break;
      case HEALTH_CHECK_TYPES.PING:
        await processHealthCheckPing(params);
        break;
      case HEALTH_CHECK_TYPES.USER_SESSION_DELETE:
        await processHealthCheckUserSessionDelete(params);
        break;
      case HEALTH_CHECK_TYPES.USER_SESSION_VIEW:
        await processHealthCheckUserSessionView(params);
        break;
      default:
        break;
    }
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, { healthCheckType });
    logger.error('processHealthCheck', { ACA_ERROR });
    throw ACA_ERROR;
  }
}

module.exports = {
  isHealthCheckMessage,
  processHealthCheckMessage,
}
