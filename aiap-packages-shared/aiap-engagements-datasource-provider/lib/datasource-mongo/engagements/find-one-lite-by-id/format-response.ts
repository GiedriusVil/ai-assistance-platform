/*
    © Copyright IBM Corporation 2022. All Rights Reserved 
     
    SPDX-License-Identifier: EPL-2.0
*/
import lodash from '@ibm-aca/aca-wrapper-lodash';

import {
  IFormatEngagementLiteResponseObject
} from '../../../types';

export function formatResponse(
  object: IFormatEngagementLiteResponseObject
) {
  let RET_VAL;
  if (!lodash.isEmpty(object)) {
    RET_VAL = {
      id: object?._id,
      name: object?.name,
      assistant: object?.assistant,
      assistantDisplayName: object?.assistantDisplayName,
      chatApp: object?.chatApp,
      chatAppServer: object?.chatAppServer,
      soe: object?.soe,
    };
  }
  return RET_VAL;
}
