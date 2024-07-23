/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import * as lodash from 'lodash';
import * as ramda from 'ramda';

export function replaceByIdOrAddAsNew(objects: Array<any>, object: any) {
  if (
    lodash.isArray(objects) &&
    lodash.isObject(object)
  ) {
    const OBJECT_ID = ramda.path(['id'], object);
    const INDEX = lodash.findIndex(objects, { id: OBJECT_ID });
    if (INDEX < 0) {
      objects.push(object);
    } else {
      objects.splice(INDEX, 1, object);
    }
  }
}

export function convertArrayToQueryParamsString(paramName: string, array: any[]) {
  let string = '';
  array.map((item) => {
    string += `&${paramName}=${item}`;
  });
  return string;
}
