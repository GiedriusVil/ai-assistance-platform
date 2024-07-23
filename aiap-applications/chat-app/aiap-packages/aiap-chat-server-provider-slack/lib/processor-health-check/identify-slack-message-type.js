
/*
	© Copyright IBM Corporation 2022. All Rights Reserved 
	 
	SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-chat-server-session-provider-processor-health-check-identify-outgoing-message-type';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const ramda = require('@ibm-aca/aca-wrapper-ramda');
const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { formatIntoAcaError } = require('@ibm-aca/aca-utils-errors');
const { HEALTH_CHECK_TYPES } = require('./health-check-types');

const identifySlackMessageType = (params) => {
    const MESSAGE_TEXT = ramda.path(['message', 'text'], params);
    let retVal;
    try {
        if (
            !lodash.isEmpty(MESSAGE_TEXT)
        ) {
            if (
                MESSAGE_TEXT.startsWith(HEALTH_CHECK_TYPES.CONFIGURATION)
            ) {
                retVal = HEALTH_CHECK_TYPES.CONFIGURATION;
                return retVal;
            }
            if (
                MESSAGE_TEXT.startsWith(HEALTH_CHECK_TYPES.HELP)
            ) {
                retVal = HEALTH_CHECK_TYPES.HELP;
                return retVal;
            }
            if (
                MESSAGE_TEXT.startsWith(HEALTH_CHECK_TYPES.MIRROR)
            ) {
                retVal = HEALTH_CHECK_TYPES.MIRROR;
                return retVal;
            }
            if (
                MESSAGE_TEXT.startsWith(HEALTH_CHECK_TYPES.PING)
            ) {
                retVal = HEALTH_CHECK_TYPES.PING;
                return retVal;
            }
            if (
                MESSAGE_TEXT.startsWith(HEALTH_CHECK_TYPES.USER_SESSION_VIEW)
            ) {
                retVal = HEALTH_CHECK_TYPES.USER_SESSION_VIEW;
                return retVal;
            }
            if (
                MESSAGE_TEXT.startsWith(HEALTH_CHECK_TYPES.USER_SESSION_DELETE)
            ) {
                retVal = HEALTH_CHECK_TYPES.USER_SESSION_DELETE;
                return retVal;
            }
        }
        return retVal;
    } catch (error) {
        const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
        logger.error('identifySlackMessageType', { ACA_ERROR });
        throw ACA_ERROR;
    }
}


module.exports = {
    identifySlackMessageType,
}
