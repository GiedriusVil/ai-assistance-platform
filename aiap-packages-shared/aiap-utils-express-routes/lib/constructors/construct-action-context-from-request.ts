/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import lodash from '@ibm-aca/aca-wrapper-lodash';

import {
  uuidv4,
} from '@ibm-aca/aca-wrapper-uuid';

import {
  IContextV1,
} from '@ibm-aiap/aiap--types-server';

export const constructActionContextFromRequest = (
  request: any,
): IContextV1 => {
  const RET_VAL: IContextV1 = {
    action: {
      id: uuidv4(),
    }
  };
  if (
    !lodash.isEmpty(request?.user?.id) &&
    !lodash.isEmpty(request?.user?.username)
  ) {
    RET_VAL.user = {
      id: request?.user?.id,
      username: request?.user?.username,
      timezone: request?.user?.timezone,
      session: request?.user?.session
    }
  }
  return RET_VAL;
}

