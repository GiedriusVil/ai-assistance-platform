/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import lodash from '@ibm-aca/aca-wrapper-lodash';

const sanitizeIdAttribute = (
  object: {
    id?: any,
    _id?: any,
  }
) => {
  if (
    !lodash.isEmpty(object) &&
    lodash.isObject(object)
  ) {
    const ID = object._id;
    object.id = ID;
    delete object._id;
  }
};

export {
  sanitizeIdAttribute,
}
