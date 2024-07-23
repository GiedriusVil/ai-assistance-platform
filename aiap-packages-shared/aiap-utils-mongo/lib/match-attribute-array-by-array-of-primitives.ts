/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import lodash from '@ibm-aca/aca-wrapper-lodash';

const matchAttributeArrayByArrayOfPrimitives = (
  arrayAttribute: string,
  attribute: string,
  arrayOfPrimitives: any,
) => {
  const RET_VAL = {};
  if (
    !lodash.isEmpty(arrayAttribute) &&
    lodash.isString(arrayAttribute) &&
    !lodash.isEmpty(attribute) &&
    lodash.isString(attribute) &&
    !lodash.isEmpty(arrayOfPrimitives) &&
    lodash.isArray(arrayOfPrimitives)
  ) {
    RET_VAL[arrayAttribute] = { $exists: true, $ne: [] };
    RET_VAL[`${arrayAttribute}.${attribute}`] = { $in: arrayOfPrimitives };
  }
  return RET_VAL;
}

export {
  matchAttributeArrayByArrayOfPrimitives,
}
