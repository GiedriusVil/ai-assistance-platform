/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import lodash from '@ibm-aca/aca-wrapper-lodash';

import {
  AI_SERVICE_TYPE_ENUM,
  IAiSkillV1,
} from '@ibm-aiap/aiap--types-server';

export const wrapIntoAiSkillsV1 = (
  type: AI_SERVICE_TYPE_ENUM,
  skills: Array<any>,
): Array<IAiSkillV1> => {
  const RET_VAL: Array<IAiSkillV1> = [];
  if (
    !lodash.isEmpty(skills)
  ) {
    for (const SKILL of skills) {
      RET_VAL.push(
        {
          type: type,
          external: {
            ...SKILL,
          }
        }
      );
    }
  }
  return RET_VAL;
}
