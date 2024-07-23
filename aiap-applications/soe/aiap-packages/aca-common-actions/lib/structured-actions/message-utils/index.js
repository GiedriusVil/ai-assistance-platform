/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/

const MODULE_ID = 'aca-common-actions-structured-actions-message-utils';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const ramda = require('@ibm-aca/aca-wrapper-ramda');

const attachmentTransformer = require('./attachments');

const _stringToBoolean = (string) => {
  const VALUE = ramda.toLower(string).trim();
  if (['true', 'yes', '1'].includes(VALUE)) return true;
  if (['false', 'no', '0', 'null'].includes(VALUE)) return false;
  return !!VALUE;
};

const ATTACHMENT_TYPE = {
  FORM: 'form',
  FEEDBACK: 'feedback',
  BUTTONS: 'buttons',
  DROPDOWN: 'dropdown',
  BUTTONS_LIST: 'buttonsList',
  IMAGE: 'image',
  VIDEO: 'video',
  WDS: 'wds',
};

const messageUtils = (actionName, attributes, attachments) => {
  const ATTACHMENT = {
    type: actionName,
    attributes: [],
    attachments: attachments,
  };
  let retVal;

  if (attributes) {
    if (attributes.caption) {
      ATTACHMENT.attributes.push({ key: 'caption', value: attributes.caption });
    }
    if (attributes.disableInput) {
      ATTACHMENT.attributes.push({ key: 'disableInput', value: _stringToBoolean(attributes.disableInput) });
    }
  }

  switch (actionName) {
    case ATTACHMENT_TYPE.VIDEO:
      retVal = attachmentTransformer.video.transform(ATTACHMENT, attributes);
      break;
    default:
      retVal = ATTACHMENT;
      break;
  }
  return retVal;
};

module.exports = messageUtils;
