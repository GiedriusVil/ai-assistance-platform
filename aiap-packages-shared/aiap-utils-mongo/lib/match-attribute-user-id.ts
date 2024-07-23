/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import lodash from '@ibm-aca/aca-wrapper-lodash';

/**
 * 
 * @param params 
 * @returns 
 * @deprecated -> Use more generic matcher!
 */
const matchAttributeUserId = (
  params: {
    userId: any,
  },
) => {
  const RET_VAL = {};
  const USER_ID = params?.userId;
  if (
    !lodash.isEmpty(USER_ID)
  ) {
    RET_VAL['userId'] = {
      $regex: USER_ID,
      $options: 'i'
    };
  }
  return RET_VAL;
};

export {
  matchAttributeUserId,
}
