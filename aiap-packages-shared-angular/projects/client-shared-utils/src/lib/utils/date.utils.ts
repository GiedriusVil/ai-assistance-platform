/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import * as lodash from 'lodash';
import * as ramda from 'ramda';

const _deserializeDateByPath = (path, value) => {
  let retVal = value;
  const dateAsString = ramda.path(path, value);
  if (
    !lodash.isEmpty(dateAsString) &&
    lodash.isString(dateAsString)
  ) {
    const DATE = new Date(dateAsString);
    retVal = ramda.assocPath(path, DATE, value);
  }
  return retVal;
}

export function deserializeDatesInValue(value: any) {
  let retVal = lodash.cloneDeep(value);

  if (
    lodash.isObject(retVal)
  ) {
    retVal = _deserializeDateByPath(['effective'], retVal);
    retVal = _deserializeDateByPath(['expires'], retVal);
  }
  return retVal;
}
