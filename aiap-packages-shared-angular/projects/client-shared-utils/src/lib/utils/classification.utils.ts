/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/

import * as ramda from 'ramda';

export function transformClassifications(value: any): any {
  if (
    ramda.includes('CREATE_ONE', value)
  ) {
    return 'CREATE';
  } else if (
    ramda.includes('FIND_ONE', value) ||
    ramda.includes('FIND_MANY_BY_QUERY', value)
  ) {
    return 'FIND'
  } else if (
    ramda.includes('SAVE_ONE', value)
  ) {
    return 'UPDATE';
  } else {
    return value;
  }
}
