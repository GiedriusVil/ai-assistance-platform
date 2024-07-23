
/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-chat-server-provider-slack-processor-outgoing-message-index';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const ramda = require('@ibm-aca/aca-wrapper-ramda');
const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { formatIntoAcaError, appendDataToError } = require('@ibm-aca/aca-utils-errors');

const { OUTGOING_MESSAGE_TYPE } = require('./outgoing-message-types');
const { identifyOutgoingMessageType } = require('./identify-outgoing-message-type');

const { processDefaultByAttachmentAcaDebug } = require('./process-default-by-attachment-aca-debug');
const { processDefaultByAttachmentAcaError } = require('./process-default-by-attachment-aca-error');
const { processDefaultByAttachment } = require('./process-default-by-attachment');
const { processDefault } = require('./process-default');
const { processEmpty } = require('./process-empty');
const { processTypingOFF } = require('./process-typing-off');
const { processTypingON } = require('./process-typing-on');

const processOutgoingMessage = async (context, params) => {
  const PROVIDER_CONVERSATION_ID = ramda.path(['provider', 'id'], context);
  let outgoingMessageType;
  try {
    outgoingMessageType = identifyOutgoingMessageType(context, params);
    switch (outgoingMessageType) {
      case OUTGOING_MESSAGE_TYPE.EMPTY:
        await processEmpty(context, params);
        break;
      case OUTGOING_MESSAGE_TYPE.TYPING_ON:
        await processTypingON(context, params);
        break;
      case OUTGOING_MESSAGE_TYPE.TYPING_OFF:
        await processTypingOFF(context, params);
        break;
      case OUTGOING_MESSAGE_TYPE.DEFAULT_BY_ATTACHMENT:
        await processDefaultByAttachment(context, params);
        break;
      case OUTGOING_MESSAGE_TYPE.DEFAULT_BY_ATTACHMENT_ACA_DEBUG:
        await processDefaultByAttachmentAcaDebug(context, params);
        break;
      case OUTGOING_MESSAGE_TYPE.DEFAULT_BY_ATTACHMENT_ACA_ERROR:
        await processDefaultByAttachmentAcaError(context, params);
        break;
      default:
        await processDefault(context, params);
        break;
    }
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, { PROVIDER_CONVERSATION_ID });
    logger.error('transformOutgoingMessage', { ACA_ERROR });
    throw ACA_ERROR;
  }
}

module.exports = {
  processOutgoingMessage,
}
