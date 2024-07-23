/*
	© Copyright IBM Corporation 2022. All Rights Reserved 
	 
	SPDX-License-Identifier: EPL-2.0
*/

const MODULE_ID = 'aca-adapter-slack-services-messages-replace-interaction-by-id';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const ramda = require('@ibm-aca/aca-wrapper-ramda');
const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { loadLambdaModuleAsSlackComponent } = require('@ibm-aca/aca-lambda-modules-executor');
const { formatIntoAcaError } = require('@ibm-aca/aca-utils-errors');

const { formatHtmlTags } = require('../../utils');

const replaceInteractionById = async (params) => {
    try {
        let BOT_LAST_MESSAGE = ramda.path(['lastBotMessage', 'message'], params);
        const CHANNEL = ramda.path(['userMessage', 'channel'], params);
        const USER_TEXT = ramda.path(['userMessage', 'text'], params);
        const SLACK_MESSAGE_ID = ramda.path(['lastBotMessage', 'slackMessageId'], params);
        const ATTACHMENT_BUTTON_NAME = ramda.path(['lastBotMessage', 'attachment', 'buttonName'], params);
        const TENANT_ID = ramda.path(['lastBotMessage', 'tenantId'], params);
        const ATTACHMENT_TYPE = ramda.path(['lastBotMessage', 'attachment', 'type'], params);
        const WEB = ramda.path(['webChat'], params);

        if (lodash.isEmpty(BOT_LAST_MESSAGE)){
            BOT_LAST_MESSAGE = 'You selected: ';
        }
        if (!lodash.isEmpty(ATTACHMENT_TYPE) && !lodash.isEmpty(SLACK_MESSAGE_ID)) {
            const ATTACHMENT_TYPE_FOR_LAMBDA_MODULE = 'slack' + ATTACHMENT_TYPE + 'disabled';
            const CONTEXT = {
                gAcaProps: this.gAcaProps
            };
            const PARAMS = {
                lambdaModule: {
                    id: ATTACHMENT_TYPE_FOR_LAMBDA_MODULE
                },
                tenant: {
                    id: TENANT_ID
                },
                attachment: {
                    buttonName: ATTACHMENT_BUTTON_NAME,
                    userText: USER_TEXT
                }
            };
            const LAMBDA_MODULE_SLACK = await loadLambdaModuleAsSlackComponent(CONTEXT, PARAMS);
            if (lodash.isEmpty(LAMBDA_MODULE_SLACK)) {
                logger.error('[ADAPTER][SLACK] Unable to handle attachment type: ', ATTACHMENT_TYPE_FOR_LAMBDA_MODULE);
            }
            WEB.chat.update({
                channel: CHANNEL,
                ts: SLACK_MESSAGE_ID,
                text: formatHtmlTags(BOT_LAST_MESSAGE),
                attachments: [LAMBDA_MODULE_SLACK]
            });
        }
    } catch (error) {
        const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
        logger.error('->', { ACA_ERROR });
        throw ACA_ERROR;
    }
}

module.exports = {
    replaceInteractionById
}
