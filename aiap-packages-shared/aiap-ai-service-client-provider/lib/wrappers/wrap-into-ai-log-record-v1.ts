/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import lodash from '@ibm-aca/aca-wrapper-lodash';

import {
  AI_SERVICE_TYPE_ENUM,
  IAiLogRecordV1,
} from '@ibm-aiap/aiap--types-server';

export const wrapIntoAiLogRecordV1 = (
  type: AI_SERVICE_TYPE_ENUM,
  logs: Array<any>,
): Array<IAiLogRecordV1> => {
  const RET_VAL: Array<IAiLogRecordV1> = [];
  if (
    !lodash.isEmpty(logs)
  ) {
    for (const LOG of logs) {
      RET_VAL.push(
        {
          type: type,
          external: {
            ...LOG,
          }
        }
      );
    }
  }
  return RET_VAL;
}
