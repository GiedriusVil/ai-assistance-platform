/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import lodash from '@ibm-aca/aca-wrapper-lodash';

import {
  AI_SERVICE_TYPE_ENUM,
  IAiDialogNodeV1,
} from '@ibm-aiap/aiap--types-server';

export const wrapIntoIAiDialogNodeV1 = (
  type: AI_SERVICE_TYPE_ENUM,
  nodes: Array<any>,
) => {
  const RET_VAL: Array<IAiDialogNodeV1> = [];
  if (
    !lodash.isEmpty(nodes) &&
    lodash.isArray(nodes)
  ) {
    for (const NODE of nodes) {
      RET_VAL.push({
        type: type,
        external: {
          ...NODE,
        }
      });
    }
  }
  return RET_VAL;
}
