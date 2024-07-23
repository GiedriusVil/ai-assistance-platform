/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import lodash from '@ibm-aca/aca-wrapper-lodash';

const matchAttributeArrayLessThanValue = (
  arrayAttribute: string,
  attribute: string,
  value: any,
) => {
  const RET_VAL = {};
  if (
    !lodash.isEmpty(arrayAttribute) &&
    lodash.isString(arrayAttribute) &&
    !lodash.isEmpty(attribute) &&
    lodash.isString(attribute) &&
    lodash.isNumber(value)
  ) {
    RET_VAL[arrayAttribute] = { $exists: true, $ne: [] };
    RET_VAL[`${arrayAttribute}.${attribute}`] = { $lt: value };
  }
  return RET_VAL;
};

export {
  matchAttributeArrayLessThanValue,
}
