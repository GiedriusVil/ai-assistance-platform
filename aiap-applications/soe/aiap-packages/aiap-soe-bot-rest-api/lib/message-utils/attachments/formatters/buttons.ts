/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-soe-bot-rest-api-message-utils-formatters-buttons';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import ramda from '@ibm-aca/aca-wrapper-ramda';

const format = sourceButtons => {
  const resultButtons = [];
  const resultQuickReplies = [];

  sourceButtons.forEach(button => {
    if (button.title && button.title.length > 20) {
      logger.warn(`Button malformed. 'title' longer then 20 characters for button of type '${button.type}'`);
      return;
    }
    switch (button.type) {
      case 'phone_number':
        resultButtons.push({
          type: 'phone_number',
          title: button.title,
          payload: button.payload,
        });
        break;

      case 'postback':
        resultButtons.push({
          type: 'postback',
          title: button.title,
          payload: button.payload,
        });
        break;

      case 'web_url':
        resultButtons.push({
          type: 'web_url',
          url: button.url,
          title: button.title,
        });
        break;

      //quick replies
      case undefined:
      case 'location':
      case 'text':
      case 'user_email':
      case 'user_phone_number': {
        const btn = formatQuickReply(button.type ? button.type : 'text', button);
        if (btn) resultQuickReplies.push(btn);
        break;
      }
    }
  });

  return {
    buttons: resultButtons,
    quick_replies: resultQuickReplies,
  };
};

const formatQuickReply = (type, button) => {
  if (!button.title && !button.image_url) {
    logger.warn(`Button malformed. No 'title' or 'image_url' provided for button of type 'text'`);
    return;
  }
  if (!button.payload && !button.image_url) {
    logger.warn(`Button malformed. No payload or 'image_url' provided for button of type 'text'`);
    return;
  }
  const result = {
    content_type: type,
    title: button.title,
    payload: button.payload,
    image_url: button.image_url,
  };
  const RET_VAL = ramda.reject(val => val == null, result);
  return RET_VAL;
};

export {
  format,
}
