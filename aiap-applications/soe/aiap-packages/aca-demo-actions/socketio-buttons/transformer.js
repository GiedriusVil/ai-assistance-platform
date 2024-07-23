/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const logger = require('@ibm-aca/aca-common-logger')('socketio-buttons-action');

const R = require('ramda');

const transformButtons = (sourceButtons, msgText) => {
  const result = {
    attachment: null,
    quick_replies: null,
  };

  const buttons = [];
  const quickReplies = [];

  const attachmentTemplate = {
    type: 'template',
    payload: {
      template_type: 'button',
      text: msgText,
      buttons: [],
    },
  };

  sourceButtons.forEach(button => {
    if (button.title && button.title.length > 50) {
      logger.warn(`Button malformed. 'title' longer then 50 characters for button of type '${button.type}'`);
      return;
    }
    switch (button.type) {
      case 'phone_number':
        buttons.push({
          type: 'phone_number',
          title: button.title,
          payload: button.payload,
        });
        break;

      case 'postback':
        buttons.push({
          type: 'postback',
          title: button.title,
          payload: button.payload,
        });
        break;

      case 'web_url':
        buttons.push({
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
        const btn = transformQuickReply(button.type ? button.type : 'text', button);
        if (btn) quickReplies.push(btn);
        break;
      }
    }
  });

  if (buttons.length > 0) {
    attachmentTemplate.payload.buttons.push(...buttons);
    result.attachment = attachmentTemplate;
  }

  if (quickReplies.length > 0) result.quick_replies = quickReplies;

  return result;
};

const transformQuickReplies = quickReplies => {
  const result = [];
  quickReplies.forEach(quickReply => {
    if (quickReply.length > 50) {
      logger.warn(`Quick reply button malformed. 'title' longer then 50 characters for button of type 'text'}'`);
      return;
    }
    result.push(
      transformQuickReply('text', {
        title: quickReply,
        payload: quickReply,
      })
    );
  });
  return result;
};

const transformQuickReply = (type, button) => {
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
  return R.reject(val => val == null, result);
};

module.exports = {
  transformButtons,
  transformQuickReplies,
};
