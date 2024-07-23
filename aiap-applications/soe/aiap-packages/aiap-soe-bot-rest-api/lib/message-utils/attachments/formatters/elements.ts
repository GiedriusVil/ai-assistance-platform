/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-soe-bot-rest-api-message-utils-formatters-elements';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import ramda from '@ibm-aca/aca-wrapper-ramda';

import * as buttonsFormatter from './buttons';
import * as defaultActionFormatter from './default-actions';

const format = sourceElements => {
  const result = [];

  sourceElements.forEach(sourceElement => {
    if (sourceElement.title == undefined) {
      logger.warn(`Element malformed. No 'title' provided`);
      return;
    }
    if (sourceElement.title && sourceElement.title.length > 80) {
      logger.warn(`Element malformed. 'title' longer then 80 characters`);
      return;
    }
    if (sourceElement.subtitle && sourceElement.subtitle.length > 80) {
      logger.warn(`Element malformed. 'subtitle' longer then 80 characters`);
      return;
    }
    let element = {
      title: sourceElement.title,
      subtitle: sourceElement.subtitle,
      image_url: sourceElement.image_url,
      default_action: defaultActionFormatter.format(sourceElement.default_action),
      buttons: buttonsFormatter.format(sourceElement.buttons),
    };
    //Remove empty properties
    element = ramda.reject(v => v == null || v.length == 0, element);
    result.push(element);
  });

  return result;
};

export {
  format,
}
