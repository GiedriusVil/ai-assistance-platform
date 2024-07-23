/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import ramda from '@ibm-aca/aca-wrapper-ramda';

import * as formatters from './formatters'

const transform = (message) => {
  const result: any = {};

  const attributes = ramda.path(['attachment', 'attributes'], message) || [];

  const text = attributes.find(item => item.key === 'text');
  if (
    text
  ) {
    result.text = text.value;
  }

  const attachments = ramda.path(['attachment', 'attachments'], message);
  if (
    Array.isArray(attachments) &&
    attachments.length > 0
  ) {
    const buttons = formatters.buttons.format(attachments);
    if (
      buttons.buttons.length > 0
    ) {
      const attachment = {
        type: 'template',
        payload: {
          template_type: 'button',
          buttons: buttons.buttons,
        },
      };
      result.attachment = attachment;
    }
    if (buttons.quick_replies.length > 0) {
      result.quick_replies = buttons.quick_replies;
    }
  }
  return result;
};

export {
  transform,
}
