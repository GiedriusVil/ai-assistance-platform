/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import ramda from '@ibm-aca/aca-wrapper-ramda';

import * as formatters from './formatters'

const transform = (message) => {
  const result: any = {};

  const attachments = ramda.path(['attachment', 'attachments'], message);
  if (
    Array.isArray(attachments) &&
    attachments.length > 0
  ) {
    const elements = formatters.elements.format(attachments);
    if (
      elements.length > 0
    ) {
      const attachment = {
        type: 'template',
        payload: {
          template_type: 'generic',
          elements: [],
        },
      };
      attachment.payload.elements.push(...elements);
      result.attachment = attachment;
    }
  }
  return result;
};

export {
  transform,
}
