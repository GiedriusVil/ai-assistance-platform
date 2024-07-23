/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-adapter-slack-services-messages-format-outgoing-message';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const ramda = require('@ibm-aca/aca-wrapper-ramda');
const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { formatHtmlTags } = require('../../utils');
const lambdaModulesService = require('../lambda-modules');

const formatOutgoingMessage = async (params) => {
  let outgoingMessage = ramda.path(['outgoingMessage'], params);
  const CHANNEL = ramda.path(['channel'], params);
  const CONTEXT = ramda.path(['context'], outgoingMessage);
  const CONTEXT_KEYS = Object.keys(CONTEXT);
  const LAST_RETRIEVE_CONTEXT = ramda.path(['lastRetrieveAction'], CONTEXT)
  // const FILTERED_KEYS = CONTEXT_KEYS.filter(key => key.includes('s2pRetrieve'));
  const FILTERED_KEYS = CONTEXT_KEYS.filter(key => key.includes(LAST_RETRIEVE_CONTEXT));
  const ATTACHMENT_TYPE = ramda.path(['message', 'attachment', 'type'], outgoingMessage);
  const DISPLAY_ACTION_TAG = ramda.path(['message', 'text'], outgoingMessage)
  outgoingMessage.as_user = true;
  outgoingMessage.channel = CHANNEL;
  delete outgoingMessage.recipient;

  if (!lodash.isEmpty(DISPLAY_ACTION_TAG)) {
    if (DISPLAY_ACTION_TAG.includes('s2pDisplay')) {
      let EXTRACT_ACTION_TAG_NAME = DISPLAY_ACTION_TAG.split('>')
      EXTRACT_ACTION_TAG_NAME = EXTRACT_ACTION_TAG_NAME[0].substr(1)
      const LAMBDA_MODULE_COMPONENT = await constructAttachmentsFromLambdaModules({
        context: CONTEXT,
        attachmentType: EXTRACT_ACTION_TAG_NAME
      })
      if (lodash.isEmpty(LAMBDA_MODULE_COMPONENT)) {
        logger.error('[SLACK SESSION PROVIDER] Lambda module was not found');
      }
      outgoingMessage.attachments = JSON.stringify([LAMBDA_MODULE_COMPONENT]);
      outgoingMessage.message.text = ' '

    }

    if (outgoingMessage.message && outgoingMessage.message.text) {
      outgoingMessage.text = formatHtmlTags(outgoingMessage.message.text);
    }
  }

  if (!lodash.isEmpty(FILTERED_KEYS)) {
    const RETRIEVE_ACTION_TAG_NAME = FILTERED_KEYS[0];
    const ACTION_TAG_FROM_CONTEXT = ramda.path(['context', RETRIEVE_ACTION_TAG_NAME], outgoingMessage);
    // const RESPONSE_PAYLOAD = ramda.path(['response',0,'payload'], ACTION_TAG_FROM_CONTEXT);
    const HTML_MESSAGE = ramda.path(['message', 'text'], outgoingMessage)

    // if (!lodash.isEmpty(RESPONSE_PAYLOAD)) {
    if (HTML_MESSAGE.includes('<div')) {
      const LAMBDA_MODULE_COMPONENT = await constructAttachmentsFromLambdaModules({
        context: CONTEXT,
        attachmentType: RETRIEVE_ACTION_TAG_NAME,
        attachmentContent: ACTION_TAG_FROM_CONTEXT
      });
      if (lodash.isEmpty(LAMBDA_MODULE_COMPONENT)) {
        logger.error('[SLACK SESSION PROVIDER] Lambda module was not found', ATTACHMENT_TYPE);
      }
      outgoingMessage.text = ' '
      outgoingMessage.attachments = JSON.stringify([LAMBDA_MODULE_COMPONENT]);
    }
  }

  if (!lodash.isEmpty(ATTACHMENT_TYPE)) {
    const ATTACHMENT_CONTENT = ramda.path(['message', 'attachment'], outgoingMessage);
    const LAMBDA_MODULE_COMPONENT = await constructAttachmentsFromLambdaModules({
      context: CONTEXT,
      attachmentType: ATTACHMENT_TYPE,
      attachmentContent: ATTACHMENT_CONTENT
    });
    if (lodash.isEmpty(LAMBDA_MODULE_COMPONENT)) {
      logger.error('[SLACK SESSION PROVIDER] Lambda module was not found', ATTACHMENT_TYPE);
    }
    outgoingMessage.attachments = JSON.stringify([LAMBDA_MODULE_COMPONENT]);
  }
  return outgoingMessage;


}
const constructAttachmentsFromLambdaModules = async (params) => {
  const CONTEXT = ramda.path(['context'], params);
  const ATTACHEMENT_TYPE = ramda.path(['attachmentType'], params);
  const ATTACHMENT_CONTENT = ramda.path(['attachmentContent'], params);

  const LAMBDA_MODULE_COMPONENT = await lambdaModulesService.loadSlackComponentTemplate({
    context: CONTEXT,
    attachmentType: ATTACHEMENT_TYPE,
    attachmentContent: ATTACHMENT_CONTENT
  });
  return LAMBDA_MODULE_COMPONENT;
}

module.exports = {
  formatOutgoingMessage
}
