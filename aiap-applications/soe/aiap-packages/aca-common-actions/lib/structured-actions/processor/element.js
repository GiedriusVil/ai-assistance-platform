/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const buttonProcessor = require('./button');
const defaultActionProcessor = require('./default_action');

const process = elementItem => {
  const buttons = [];
  const element = {
    title: elementItem.attrs.title,
    subtitle: elementItem.attrs.subtitle,
    imageUrl: elementItem.attrs.image_url,
  };

  const contentItems = Array.isArray(elementItem.content) ? elementItem.content : [];
  contentItems.forEach(contentItem => {
    if (contentItem != null && typeof contentItem == 'object' && contentItem.tag == 'default_action') {
      element.defaultAction = defaultActionProcessor.process(contentItem);
    }
    if (contentItem != null && typeof contentItem == 'object' && contentItem.tag == 'button') {
      buttons.push(buttonProcessor.process(contentItem));
    }
  });
  element.buttons = buttons;

  return element;
};

module.exports = {
  process,
};
