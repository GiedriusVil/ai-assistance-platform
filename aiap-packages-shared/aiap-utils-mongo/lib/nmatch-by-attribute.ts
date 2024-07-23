/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import lodash from '@ibm-aca/aca-wrapper-lodash';

const nMatchByAttribute = (
  attribute: string,
  value: any,
) => {
  const RET_VAL = {};

  if (
    !lodash.isEmpty(attribute) &&
    lodash.isString(attribute) &&
    lodash.isString(value)
  ) {
    RET_VAL[attribute] = {
      $ne: value
    };
  }
  return RET_VAL;
};

export {
  nMatchByAttribute,
}
