/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const lodash = require('@ibm-aca/aca-wrapper-lodash');

import {
  IAiTranslationModelV1
} from '@ibm-aiap/aiap--types-server';

import { 
  sanitizeIdAttribute 
} from '@ibm-aiap/aiap-utils-mongo';

const formatResponse = (
  records: Array<any>,
): Array<IAiTranslationModelV1> => {
  const RET_VAL = [];
  if (
    !lodash.isEmpty(records) &&
    lodash.isArray(records)
  ) {
    for (let record of records) {
      sanitizeIdAttribute(record);
      RET_VAL.push(record);
    }
  }
  return RET_VAL;
};

export {
  formatResponse,
};
