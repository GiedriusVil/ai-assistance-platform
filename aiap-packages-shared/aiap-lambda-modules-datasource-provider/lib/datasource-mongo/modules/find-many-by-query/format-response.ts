/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import lodash from '@ibm-aca/aca-wrapper-lodash';

import { sanitizeIdAttribute } from '@ibm-aiap/aiap-utils-mongo';

import {
  ILambdaModuleV1,
} from '@ibm-aiap/aiap--types-server';

const formatResponse = (records: any[]): ILambdaModuleV1[] => {
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
