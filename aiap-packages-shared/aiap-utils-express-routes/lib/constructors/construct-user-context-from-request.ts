/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import lodash from '@ibm-aca/aca-wrapper-lodash';

import {
  IContextUserV1,
} from '@ibm-aiap/aiap--types-server';

export const constructUserContextFromRequest = (
  request: any,
): {
  user?: IContextUserV1,
} => {
  const RET_VAL: {
    user?: IContextUserV1,
  } = {};

  if (
    !lodash.isEmpty(request?.user?.id) &&
    !lodash.isEmpty(request?.user?.username) &&
    !lodash.isEmpty(request?.user?.company?.id) &&
    !lodash.isEmpty(request?.user?.token?.access) &&
    !lodash.isEmpty(request?.user?.token?.accessExpiry) &&
    !lodash.isEmpty(request?.user?.token?.refresh)
  ) {
    RET_VAL.user = {
      id: request?.user?.id,
      username: request?.user?.username,
      company: {
        id: request?.user?.company?.id
      },
      token: {
        access: request?.user?.token?.access,
        accessExpiry: request?.user?.token?.accessExpiry,
        refresh: request?.user?.token?.refresh,
      }
    };
  }

  return RET_VAL;
}
