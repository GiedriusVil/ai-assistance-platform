/*
	© Copyright IBM Corporation 2022. All Rights Reserved 
	 
	SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-chat-server-session-provider-processor-outgoing-message-message-identify-outgoing-message-type';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const ramda = require('@ibm-aca/aca-wrapper-ramda');
const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { formatIntoAcaError, appendDataToError } = require('@ibm-aca/aca-utils-errors');
const { OUTGOING_MESSAGE_TYPE } = require('./outgoing-message-types');
const { OUTGOING_MESSAGE_ATTACHMENT_TYPES } = require('../utils/attachment-types.utils');
const identifyOutgoingMessageType = (context, params) => {
    const PROVIDER = ramda.path(['provider'], context);
    const PROVIDER_CONVERSATION_ID = ramda.path(['conversationId'], PROVIDER);

    const MESSAGE = ramda.path(['message'], params);
    const MESSAGE_SENDER_ACTION = ramda.path(['sender_action'], MESSAGE);
    const MESSAGE_SENDER_ACTION_TYPE = MESSAGE_SENDER_ACTION?.type === OUTGOING_MESSAGE_ATTACHMENT_TYPES.FEEDBACK;
    const MESSAGE_ATTACHMENT_TYPE = ramda.path(['message', 'attachment', 'type'], MESSAGE);
    try {
        if (
            lodash.isEmpty(MESSAGE)
        ) {
            return OUTGOING_MESSAGE_TYPE.EMPTY;
        }
        if (
            !lodash.isEmpty(MESSAGE_ATTACHMENT_TYPE) &&
            MESSAGE_ATTACHMENT_TYPE === OUTGOING_MESSAGE_TYPE.DEFAULT_BY_ATTACHMENT_ACA_DEBUG
        ) {
            return OUTGOING_MESSAGE_TYPE.DEFAULT_BY_ATTACHMENT_ACA_DEBUG;
        }
        if (
            !lodash.isEmpty(MESSAGE_ATTACHMENT_TYPE) &&
            MESSAGE_ATTACHMENT_TYPE === OUTGOING_MESSAGE_TYPE.DEFAULT_BY_ATTACHMENT_ACA_ERROR
        ) {
            return OUTGOING_MESSAGE_TYPE.DEFAULT_BY_ATTACHMENT_ACA_ERROR;
        }
        if (
            !lodash.isEmpty(MESSAGE_ATTACHMENT_TYPE) || MESSAGE_SENDER_ACTION_TYPE
        ) {
            return OUTGOING_MESSAGE_TYPE.DEFAULT_BY_ATTACHMENT
        }
        if (
            !lodash.isEmpty(MESSAGE_SENDER_ACTION) &&
            MESSAGE_SENDER_ACTION === OUTGOING_MESSAGE_TYPE.TYPING_ON
        ) {
            return OUTGOING_MESSAGE_TYPE.TYPING_ON;
        }
        if (
            !lodash.isEmpty(MESSAGE_SENDER_ACTION) &&
            MESSAGE_SENDER_ACTION === OUTGOING_MESSAGE_TYPE.TYPING_OFF
        ) {
            return OUTGOING_MESSAGE_TYPE.TYPING_OFF;
        }
        return OUTGOING_MESSAGE_TYPE.DEFAULT;
    } catch (error) {
        const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
        appendDataToError(ACA_ERROR, { PROVIDER_CONVERSATION_ID });
        logger.error('identifyOutgoingMessageType', { ACA_ERROR });
        throw ACA_ERROR;
    }
}

module.exports = {
    identifyOutgoingMessageType,
}
