/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import lodash from '@ibm-aca/aca-wrapper-lodash';

const matchByAttribute = (
  attribute,
  value,
) => {
  const RET_VAL = {};
  if (
    !lodash.isEmpty(attribute) &&
    lodash.isString(attribute) &&
    !lodash.isEmpty(value) &&
    lodash.isString(value)
  ) {
    RET_VAL[attribute] = value;
  }
  return RET_VAL;
};

export {
  matchByAttribute,
}
