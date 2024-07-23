/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import lodash from '@ibm-aca/aca-wrapper-lodash';

import {
  AI_SERVICE_TYPE_ENUM,
  IAiServiceV1,
} from '@ibm-aiap/aiap--types-server';

export const wrapIntoAiServiceV1 = (
  type: AI_SERVICE_TYPE_ENUM,
  services: Array<any>,
): Array<IAiServiceV1> => {
  const RET_VAL: Array<IAiServiceV1> = [];
  if (
    !lodash.isEmpty(services)
  ) {
    for (const SERVICE of services) {
      RET_VAL.push(
        {
          type: type,
          external: {
            ...SERVICE,
          }
        }
      );
    }
  }
  return RET_VAL;
}
