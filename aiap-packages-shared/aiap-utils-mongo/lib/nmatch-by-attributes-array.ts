/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import lodash from '@ibm-aca/aca-wrapper-lodash';

const nMatchByAttributesArray = (
  value: any,
  attributes: Array<any>
) => {
  const RET_VAL = [];
  if (
    !lodash.isEmpty(attributes) &&
    lodash.isArray(attributes) &&
    lodash.isString(value)
  ) {
    for (const attribute of attributes) {
      const ATTRIBUTES = {};
      ATTRIBUTES[attribute] = {
        $ne: value
      };
      RET_VAL.push(ATTRIBUTES);
    }
  }
  return RET_VAL;
};

export {
  nMatchByAttributesArray,
};
