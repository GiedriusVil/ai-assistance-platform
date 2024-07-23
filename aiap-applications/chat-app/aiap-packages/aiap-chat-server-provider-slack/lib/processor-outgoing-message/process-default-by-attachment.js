
/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-chat-server-session-provider-processor-outgoing-message-process-default-by-attachment';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const jsonStrigifySafe = require('json-stringify-safe');

const ramda = require('@ibm-aca/aca-wrapper-ramda');
const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { html2Markdown } = require('@ibm-aca/aca-wrapper-html-2-markdown');
const { formatIntoAcaError, throwAcaError, ACA_ERROR_TYPE, appendDataToError } = require('@ibm-aca/aca-utils-errors');
const { executeEnrichedByLambdaModule } = require('@ibm-aca/aca-lambda-modules-executor');

const _processDefaultByAttachment = async (context, params) => {
  const PROVIDER = ramda.path(['provider'], context);
  const PROVIDER_CONVERSATION_ID = ramda.path(['conversationId'], PROVIDER);
  const PROVIDER_CLIENT = PROVIDER.client();
  const PROVIDER_SLACK = ramda.path(['slack'], PROVIDER);
  const PROVIDER_SLACK_CHANNEL_ID = ramda.path(['channel', 'id'], PROVIDER_SLACK);

  const MSG = ramda.path(['message'], params);
  const MSG_MESSAGE = ramda.path(['message'], MSG);
  const MSG_MESSAGE_TEXT = ramda.path(['text'], MSG_MESSAGE);
  const MSG_MESSAGE_ATTACHMENT = ramda.path(['attachment'], MSG_MESSAGE);

  let message;
  try {
    const MSG_MESSAGE_TEXT_AS_MRKDWN_OBJ = html2Markdown(MSG_MESSAGE_TEXT);
    const MSG_MESSAGE_TEXT_AS_MRKDWN_OBJ_TEXT = ramda.path(['text'], MSG_MESSAGE_TEXT_AS_MRKDWN_OBJ);
    message = {
      channel: PROVIDER_SLACK_CHANNEL_ID,
      blocks: [
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: MSG_MESSAGE_TEXT_AS_MRKDWN_OBJ_TEXT,
          }
        }
      ]
    };
    const RET_VAL = await PROVIDER_CLIENT.chat.postMessage(message);
    const RET_VAL_TS = ramda.path(['ts'], RET_VAL);
    if (
      MSG_MESSAGE_ATTACHMENT
    ) {
      await PROVIDER_CLIENT.files.upload({
        channels: PROVIDER_SLACK_CHANNEL_ID,
        content: jsonStrigifySafe(MSG_MESSAGE_ATTACHMENT, undefined, 2),
        filename: 'MSG_MESSAGE_ATTACHMENT.json',
        thread_ts: RET_VAL_TS,
        // filetype?: string;
        // initial_comment?: string;
        // title?: string;
      });
    }
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, { PROVIDER_CONVERSATION_ID, message });
    logger.error('_processDefaultByAttachment', { ACA_ERROR });
    throw ACA_ERROR;
  }
}

const processDefaultByAttachment = async (context, params) => {
  const PROVIDER = ramda.path(['provider'], context);
  const PROVIDER_CONVERSATION_ID = ramda.path(['conversationId'], PROVIDER);
  const PROVIDER_CLIENT = PROVIDER.client();
  const PROVIDER_TENANT = ramda.path(['tenant'], PROVIDER);

  const MSG = ramda.path(['message'], params);
  const MSG_MESSAGE = ramda.path(['message'], MSG);
  const MSG_MESSAGE_SENDER_ACTION = ramda.path(['sender_action'], MSG);
  const MSG_MESSAGE_SENDER_ACTION_TYPE = ramda.path(['type'], MSG_MESSAGE_SENDER_ACTION);
  const MSG_MESSAGE_ATTACHMENT = ramda.path(['attachment'], MSG_MESSAGE);
  const MSG_MESSAGE_ATTACHMENT_TYPE = ramda.pathOr(MSG_MESSAGE_SENDER_ACTION_TYPE, ['type'], MSG_MESSAGE_ATTACHMENT);
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
    if (
      lodash.isEmpty(PROVIDER_TENANT)
    ) {
      const MESSAGE = `Missing required context.provider.tenant parameter!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }
    const CONTEXT = {
      user: {
        session: {
          tenant: PROVIDER_TENANT
        }
      },
      ...context,
    };
    const PARAMS = {
      ...params,
    };
    const L_MODULE_ID = `slack-${MSG_MESSAGE_ATTACHMENT_TYPE}`;
    await executeEnrichedByLambdaModule(L_MODULE_ID, _processDefaultByAttachment, CONTEXT, PARAMS);
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, { PROVIDER_TENANT });
    logger.error('processDefaultByAttachment', { ACA_ERROR });
    throw ACA_ERROR;
  }
}

module.exports = {
  processDefaultByAttachment,
}
