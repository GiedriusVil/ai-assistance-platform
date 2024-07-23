/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = `aiap-chat-server-provider-slack-utils-conversation-id`;
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const ramda = require('@ibm-aca/aca-wrapper-ramda');
const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { formatIntoAcaError, throwAcaError, ACA_ERROR_TYPE } = require('@ibm-aca/aca-utils-errors');

const conversationIdBySlackMessage = (message) => {
  const CHANNEL_ID = ramda.path(['channel'], message);
  const SLACK_CHANNEL_ID = ramda.pathOr(CHANNEL_ID, ['channel', 'id'], message);
  const SLACK_USER_ID = checkForMessageSubtypes(message);
  try {
    if (
      lodash.isEmpty(SLACK_CHANNEL_ID)
    ) {
      const MESSAGE = `Missing required message.channel parameter!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }
    if (
      lodash.isEmpty(SLACK_USER_ID)
    ) {
      const MESSAGE = `Missing required message.user parameter!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }
    const CURRENT_DATE = new Date();
    const CURRENT_DATE_YEAR = CURRENT_DATE.getFullYear();
    const CURRENT_DATE_MONTH = CURRENT_DATE.getMonth();
    const CURRENT_DATE_DAY = CURRENT_DATE.getDate();
    const RET_VAL =
      `${SLACK_CHANNEL_ID}.` +
      `${SLACK_USER_ID}.` +
      `${CURRENT_DATE_YEAR}.` +
      `${CURRENT_DATE_MONTH}.` +
      `${CURRENT_DATE_DAY}.`;
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error('conversationIdBySlackMessage', { ACA_ERROR });
  }
}

const checkForMessageSubtypes = (message) => {
  try {
    let slackUserId;
    const MESSAGE_SUBTYPE = ramda.path(['subtype'], message);
    if (!lodash.isEmpty(MESSAGE_SUBTYPE) && MESSAGE_SUBTYPE === 'message_changed') {
      slackUserId = ramda.path(['message', 'user'], message);
    } else {
      const USER_ID = ramda.path(['user'], message);
      slackUserId = ramda.pathOr(USER_ID, ['user', 'id'], message);
    }
    return slackUserId;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error('conversationIdBySlackMessage', { ACA_ERROR });
  }
}

module.exports = {
  conversationIdBySlackMessage,
};
