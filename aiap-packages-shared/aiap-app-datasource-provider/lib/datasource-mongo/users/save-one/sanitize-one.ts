/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import lodash from '@ibm-aca/aca-wrapper-lodash';

import {
  IUserV1,
} from '@ibm-aiap/aiap--types-domain-app';

export const sanitizeOne = (
  user: IUserV1,
) => {
  delete user.id;
  if (
    lodash.isEmpty(user.password)
  ) {
    delete user.password;
  }
}
