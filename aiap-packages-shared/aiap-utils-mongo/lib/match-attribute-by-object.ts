/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import lodash from '@ibm-aca/aca-wrapper-lodash';

const flattenObject = (
  object: any,
) => {
  const RET_VAL = {};

  for (let key1 in object) {
    if (
      !object.hasOwnProperty(key1)
    ) {
      continue;
    }

    if (
      (typeof object[key1]) == 'object' &&
      object[key1] !== null
    ) {
      let flatObject = flattenObject(object[key1]);
      for (let key2 in flatObject) {
        if (
          !flatObject.hasOwnProperty(key2)
        ) {
          continue;

        }
        RET_VAL[key1 + '.' + key2] = flatObject[key1];
      }
    } else {
      RET_VAL[key1] = object[key1];
    }
  }
  return RET_VAL;
}

const matchAttributeByObject = (
  attribute: string,
  object: any,
) => {
  const RET_VAL = {};
  if (
    !lodash.isEmpty(attribute) &&
    lodash.isString(attribute) &&
    !lodash.isEmpty(object) &&
    lodash.isObject(object)
  ) {
    const OBJECT_FLATTEN = flattenObject(object);

    for (let key of Object.keys(OBJECT_FLATTEN)) {
      RET_VAL[`${attribute}.${key}`] = OBJECT_FLATTEN[key];
    }
  }
  return RET_VAL;
};

export {
  matchAttributeByObject,
}
