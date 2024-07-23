/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import lodash from '@ibm-aca/aca-wrapper-lodash';

const matchExcludedUsers = (
  usersList: Array<any>,
) => {
  const RET_VAL = {};
  const FIELD = '_id';

  if (
    lodash.isArray(usersList) &&
    !lodash.isEmpty(usersList)
  ) {
    RET_VAL['_id'] = {};
    RET_VAL[FIELD].$not.$in = usersList;
  }
  return RET_VAL;
}

export {
  matchExcludedUsers,
}
