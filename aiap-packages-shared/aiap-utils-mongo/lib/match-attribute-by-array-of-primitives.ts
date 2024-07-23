/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import lodash from '@ibm-aca/aca-wrapper-lodash';

const matchAttributeByArrayOfPrimitives = (
  attribute: string,
  values: Array<any>,
) => {
  const RET_VAL = {};

  if (
    !lodash.isEmpty(attribute) &&
    lodash.isString(attribute) &&
    !lodash.isEmpty(values) &&
    lodash.isArray(values)
  ) {
    RET_VAL[attribute] = {
      $in: values
    };
  }
  return RET_VAL;
}

export {
  matchAttributeByArrayOfPrimitives,
}
