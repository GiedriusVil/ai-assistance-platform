/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import lodash from '@ibm-aca/aca-wrapper-lodash';

import {
  AI_SERVICE_TYPE_ENUM,
  IAiIntentV1,
} from '@ibm-aiap/aiap--types-server';

export const wrapIntoAiIntentV1 = (
  type: AI_SERVICE_TYPE_ENUM,
  intents: Array<any>,
): Array<IAiIntentV1> => {
  const RET_VAL: Array<IAiIntentV1> = [];
  if (
    !lodash.isEmpty(intents)
  ) {
    for (const INTENT of intents) {
      RET_VAL.push(
        {
          type: type,
          external: {
            ...INTENT,
          }
        }
      );
    }
  }
  return RET_VAL;
}
