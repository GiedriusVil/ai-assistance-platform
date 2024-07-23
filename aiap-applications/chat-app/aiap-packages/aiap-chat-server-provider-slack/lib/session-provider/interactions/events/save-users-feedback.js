/*
	© Copyright IBM Corporation 2022. All Rights Reserved 
	 
	SPDX-License-Identifier: EPL-2.0
*/

const MODULE_ID = 'aca-slack-session-provider-lib-interactions-events-save-users-feedback';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const ramda = require('@ibm-aca/aca-wrapper-ramda');
const lodash = require('@ibm-aca/aca-wrapper-lodash');

const messagesService = require('../../services/messages/index');
const feedbackService = require('../../services/feedbacks/index');

const { formatIntoAcaError } = require('@ibm-aca/aca-utils-errors');

const saveUsersFeedback = async (params) => {
    try {
        const G_ACA_PROPS = ramda.path(['gAcaProps'], params);
        if (!lodash.isEmpty(G_ACA_PROPS)) {
            const MESSAGE = ramda.path(['message'], params);
            const CONTEXT = {
                gAcaProps: G_ACA_PROPS,
                message: MESSAGE,
            };
            const SLACK_MESSAGE = await messagesService.findOneBySlackMessageId(CONTEXT, {});
            const FEEDBACK_SAVE_PARAMS = {
                message: SLACK_MESSAGE,
            };
            await feedbackService.saveOne(CONTEXT, FEEDBACK_SAVE_PARAMS);
        }
    } catch (error) {
        const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
        logger.error('->', { ACA_ERROR });
        throw ACA_ERROR;
    }

}

module.exports = {
    saveUsersFeedback
}
