/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-soe-bot-rest-api-message-utils-index';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import ramda from '@ibm-aca/aca-wrapper-ramda';

import * as attachmentTransformer from './attachments';


class MessageUtils {

  adapter: any;

  constructor(adapter) {
    this.adapter = adapter;
  }

  async processOutgoingMessage(update, outgoingMessage) {
    let attachments = {};
    //Transform message
    if (outgoingMessage.message && outgoingMessage.message.attachment) {
      switch (outgoingMessage.message.attachment.type) {
        case 'audio':
        case 'file':
        case 'image':
        case 'video':
          attachments = attachmentTransformer.simple.transform(outgoingMessage.message);
          break;

        case 'buttons':
          attachments = attachmentTransformer.buttons.transform(outgoingMessage.message);
          break;

        case 'elements':
          attachments = attachmentTransformer.elements.transform(outgoingMessage.message);
          break;

        default:
          break;
      }
    }

    const transformedMessage = {
      message: ramda.mergeRight(
        ramda.filter(
          v => !ramda.isNil(v) && !ramda.isEmpty(v.trim()), ramda.pick(['text'], outgoingMessage.message)
        ),
        attachments
      ),
    };

    if (
      ramda.isNil(transformedMessage.message.text) &&
      ramda.isNil(transformedMessage.message.attachment)
    ) {
      logger.error(`Either 'text' or 'attachment' should exist in message object`);
      return;
    }

    this.adapter.__save(update, transformedMessage);
  }
}

export {
  MessageUtils,
}
