/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { v4 as uuidv4 } from 'uuid';
import * as lodash from 'lodash';

export function ensureIdExistance(object: any) {
  if (
    lodash.isObject(object) &&
    lodash.isEmpty(object['id'])
  ) {
    object['id'] = uuidv4();
  }
  return object;
}
