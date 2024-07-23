/*
	© Copyright IBM Corporation 2022. All Rights Reserved 
	 
	SPDX-License-Identifier: EPL-2.0
*/

const MODULE_ID = 'aca-adapter-slack-services-messages-find-last-bot-message-with-interactions-for-replacement';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const ramda = require('@ibm-aca/aca-wrapper-ramda');
const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { formatIntoAcaError } = require('@ibm-aca/aca-utils-errors');
const { getLastBotMessage } = require('./get-last-bot-message');

const findLastBotMessageWithInteractionsForReplacement = async (params) => {
    try {
        let retVal = {};
        const LAST_BOT_MESSAGE = await getLastBotMessage(params);
        const LAST_BOT_MESSAGE_ATTACHMENT_TYPE = ramda.path(['attachment', 'type'], LAST_BOT_MESSAGE);
        const ATTACHMENT = ramda.path(['attachment'], LAST_BOT_MESSAGE);
        if (!lodash.isEmpty(ATTACHMENT)) {
            const HAS_ATTACHMENT = LAST_BOT_MESSAGE_ATTACHMENT_TYPE === 'dropdown' || LAST_BOT_MESSAGE_ATTACHMENT_TYPE === 'buttons';
            if (HAS_ATTACHMENT) {
                retVal = LAST_BOT_MESSAGE;
            }
        }
        return retVal;
    } catch (error) {
        const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
        logger.error('->', { ACA_ERROR });
        throw ACA_ERROR;
    }
}
module.exports = {
    findLastBotMessageWithInteractionsForReplacement
}
