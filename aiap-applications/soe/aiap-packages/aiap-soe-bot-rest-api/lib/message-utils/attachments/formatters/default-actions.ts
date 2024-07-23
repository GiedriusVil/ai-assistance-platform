/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-soe-bot-rest-api-message-utils-formatters-default-actions';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import ramda from '@ibm-aca/aca-wrapper-ramda';

const format = sourceDefaultAction => {
  if (sourceDefaultAction == null) return false;
  if (!sourceDefaultAction.url) {
    logger.warn(`default_action malformed. No 'url' provided`);
    return null;
  }
  const RESULT = {
    type: 'web_url',
    url: sourceDefaultAction.url,
    fallback_url: sourceDefaultAction.fallback_url,
  };
  const RET_VAL = ramda.reject(v => v == null, RESULT);
  return RET_VAL;
};

export {
  format,
}
