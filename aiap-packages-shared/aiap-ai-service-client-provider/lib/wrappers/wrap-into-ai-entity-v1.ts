/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import lodash from '@ibm-aca/aca-wrapper-lodash';

import {
  AI_SERVICE_TYPE_ENUM,
  IAiEntityV1,
} from '@ibm-aiap/aiap--types-server';

export const wrapIntoAiEntityV1 = (
  type: AI_SERVICE_TYPE_ENUM,
  entities: Array<any>,
): Array<IAiEntityV1> => {
  const RET_VAL: Array<IAiEntityV1> = [];
  if (
    !lodash.isEmpty(entities)
  ) {
    for (const ENTITY of entities) {
      RET_VAL.push(
        {
          type: type,
          external: {
            ...ENTITY,
          }
        }
      );
    }
  }
  return RET_VAL;
}
