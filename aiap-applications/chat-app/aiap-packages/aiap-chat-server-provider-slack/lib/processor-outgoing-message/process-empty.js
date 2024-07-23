
/*
	© Copyright IBM Corporation 2022. All Rights Reserved 
	 
	SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-chat-server-session-provider-processor-outgoing-message-process-empty';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const ramda = require('@ibm-aca/aca-wrapper-ramda');
const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { formatIntoAcaError, throwAcaError, ACA_ERROR_TYPE, appendDataToError } = require('@ibm-aca/aca-utils-errors');

const processEmpty = async (context, params) => {
    const PROVIDER = ramda.path(['provider'], context);

    const PROVIDER_CLIENT = PROVIDER.client();
    const PROVIDER_CONVERSATION_ID = ramda.path(['conversationId'], PROVIDER);

    const PROVIDER_SLACK = ramda.path(['slack'], PROVIDER);
    const PROVIDER_SLACK_CHANNEL = ramda.path(['channel', 'id'], PROVIDER_SLACK);

    const PARAMS_MESSAGE_TEXT = ramda.path(['message', 'text'], params);

    let message;
    try {
        if (
            lodash.isEmpty(PROVIDER_CLIENT)
        ) {
            const MESSAGE = `Missing required context.provider.client parameter!`;
            throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
        }
        if (
            lodash.isEmpty(PROVIDER_CONVERSATION_ID)
        ) {
            const MESSAGE = `Missing required context.provider.conversationId parameter!`;
            throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
        }
        message = {
            channel: PROVIDER_SLACK_CHANNEL,
            text: `EMPTY_MESSAGE`
        }
        const RET_VAL = await PROVIDER_CLIENT.chat.postMessage(message);
        return RET_VAL;
    } catch (error) {
        const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
        appendDataToError(ACA_ERROR, { message });
        logger.error('processEmpty', { ACA_ERROR });
        throw ACA_ERROR;
    }
}

module.exports = {
    processEmpty,
}
