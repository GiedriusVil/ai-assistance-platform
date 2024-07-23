/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = `aiap-chat-server-provider-slack-utils-slack-interaction-message`;
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const ramda = require('@ibm-aca/aca-wrapper-ramda');
const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { formatIntoAcaError } = require('@ibm-aca/aca-utils-errors');

const { execHttpPostRequest } = require(`@ibm-aca/aca-wrapper-http`);

const { INTERACTION_TYPES } = require('./slack-interaction-types.utils');

const slackInteractionMessage = (payload) => {
  try {
    const SLACK_CHANNEL = ramda.path(['channel', 'id'], payload);
    const SLACK_USER = ramda.path(['user', 'id'], payload);
    const MESSAGE = {
      type: ramda.path(['message', 'type'], payload),
      user: SLACK_USER,
      channel: SLACK_CHANNEL,
      tab: 'messages',
      ts: ramda.path(['message', 'ts'], payload),
      timestamp: new Date().getTime()
    };
    return MESSAGE;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error('->', { ACA_ERROR });
    throw ACA_ERROR;
  }
}

const respondToInteractiveActionUrl = async (params) => {
  const PAYLOAD = ramda.path(['payload'], params);
  const TYPE = ramda.path(['type'], params);
  const RESPONSE_URL = ramda.path(['response_url'], PAYLOAD);

  let text;
  let dropdownSelectedOptionActions;
  let buttonAction;
  let messageBlocks;
  let defaultFeedbackMessage;

  switch (TYPE) {
    case INTERACTION_TYPES.DROPDOWN:
      dropdownSelectedOptionActions = ramda.path(['actions', 0], PAYLOAD);
      text = ramda.path(['selected_option', 'text', 'text'], dropdownSelectedOptionActions);
      break;
    case INTERACTION_TYPES.BUTTON:
      buttonAction = ramda.path(['actions', 0], PAYLOAD);
      text = ramda.path(['text', 'text'], buttonAction);
      break;
    case INTERACTION_TYPES.FEEDBACK:
      messageBlocks = ramda.path(['message', 'blocks'], PAYLOAD);
      defaultFeedbackMessage = 'Thank You for feedback!';
      text = ramda.pathOr(defaultFeedbackMessage, [0, 'text', 'text'], messageBlocks);
      break
    default:
      break;
  }
  const POST_REQUEST_OPTIONS = {
    url: RESPONSE_URL,
    body: {
      text: text
    }
  };
  const RET_VAL = await execHttpPostRequest({}, POST_REQUEST_OPTIONS);
  return RET_VAL;
}

module.exports = {
  slackInteractionMessage,
  respondToInteractiveActionUrl
}
