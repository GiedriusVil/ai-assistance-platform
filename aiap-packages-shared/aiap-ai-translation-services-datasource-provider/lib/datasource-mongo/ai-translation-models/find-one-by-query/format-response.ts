/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import {
  IAiTranslationModelV1
} from '@ibm-aiap/aiap--types-server';

import { 
  sanitizeIdAttribute 
} from '@ibm-aiap/aiap-utils-mongo';

const formatResponse = (
  record: any,
): IAiTranslationModelV1 => {
  sanitizeIdAttribute(record);

  return record;
};

export {
  formatResponse,
};
