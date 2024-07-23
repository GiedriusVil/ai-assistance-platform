/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'utils-hash';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const hash = require('object-hash');

import lodash from '@ibm-aca/aca-wrapper-lodash';

const calcHashBySha1 = (
  object: any,
) => {
  let retVal;
  if (
    object
  ) {
    retVal = hash.sha1(object);
  }
  return retVal;
}

const calcHash = (
  object: any,
) => {
  let retVal;
  if (
    object
  ) {
    retVal = calcHashBySha1(object);
  }
  return retVal;
}

const removeHashField = (
  object: any,
) => {
  if (
    !lodash.isEmpty(object)
  ) {
    delete object.hash;
  }
}

export {
  calcHash,
  calcHashBySha1,
  removeHashField,
}
