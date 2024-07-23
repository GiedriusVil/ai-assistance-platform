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
export const matchAttributeId = (
  params: {
    id?: string,
  }
) => {
  const RET_VAL: any = {};
  const _ID = params?.id;
  if (
    !lodash.isEmpty(_ID)
  ) {
    RET_VAL._id = {
      $regex: _ID,
      $options: 'i'
    };
  }
  return RET_VAL;
};

