/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import lodash from '@ibm-aca/aca-wrapper-lodash';

const _sanitizeObject = (
  object: any,
) => {
  if (
    lodash.isObject(object)
  ) {
    for (const [key, value] of Object.entries(object)) {
      if (
        lodash.isObject(value) &&
        lodash.isEmpty(value)
      ) {
        delete object[key];
      }
    }
  }
}

const addSigle$SetAttributeToPipeline = (
  pipeline: Array<any>,
  field: any,
  value: any,
) => {
  if (
    !lodash.isEmpty(field)
  ) {
    if (
      lodash.isBoolean(value) ||
      !lodash.isEmpty(value) ||
      lodash.isNumber(value)
    ) {
      _sanitizeObject(value);
      const SIGLE_SET_STEP = {};
      SIGLE_SET_STEP['$set'] = {};
      SIGLE_SET_STEP['$set'][field] = value;
      pipeline.push(SIGLE_SET_STEP);
    }
  }
}

export {
  addSigle$SetAttributeToPipeline
}
