/*
	© Copyright IBM Corporation 2022. All Rights Reserved 
	 
	SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-chat-server-session-provider-processor-health-check-is-health-check-message';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const ramda = require('@ibm-aca/aca-wrapper-ramda');
const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { formatIntoAcaError } = require('@ibm-aca/aca-utils-errors');
const { HEALTH_CHECK_TYPES } = require('./health-check-types');

const { identifySlackMessageType } = require('./identify-slack-message-type')

const isHealthCheckMessage = (params) => {
    let retVal = false;
    try {
        const HEALTH_CHECK_REQUEST_TYPE = identifySlackMessageType(params);

        switch (HEALTH_CHECK_REQUEST_TYPE) {
            case HEALTH_CHECK_TYPES.CONFIGURATION:
            case HEALTH_CHECK_TYPES.HELP:
            case HEALTH_CHECK_TYPES.MIRROR:
            case HEALTH_CHECK_TYPES.PING:
            case HEALTH_CHECK_TYPES.USER_SESSION_VIEW:
            case HEALTH_CHECK_TYPES.USER_SESSION_DELETE:
                retVal = true;
                break;
            default:
                break;
        }
        return retVal;
    } catch (error) {
        const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
        logger.error('isHealthCheckMessage', { ACA_ERROR });
        throw ACA_ERROR;
    }
}

module.exports = {
    isHealthCheckMessage,
}
