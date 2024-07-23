/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import lodash from '@ibm-aca/aca-wrapper-lodash';

const matchAttributeByRegex = (
  attribute: string,
  regex: any,
) => {
  const RET_VAL = {};
  if (
    !lodash.isEmpty(attribute) &&
    lodash.isString(regex)
  ) {
    RET_VAL[attribute] = {
      $regex: regex,
      $options: 'i'
    };
  }
  return RET_VAL;
}

export {
  matchAttributeByRegex,
}
