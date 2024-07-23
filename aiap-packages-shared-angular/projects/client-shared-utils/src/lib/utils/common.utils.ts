/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = `aca-client-shared-utils-utils-common-utils`;

import { Observable, of } from "rxjs";

import * as lodash from 'lodash';
import * as ramda from 'ramda';

import { _errorX } from '../loggers';

export function handleError(notificationService: any, error: any, msg: any): Observable<void> {
  _errorX(MODULE_ID, 'handleError', { error });
  notificationService.showNotification(msg);
  return of();
}

/** Returns comparator with specified field name by which ascending sorting will be done */
export function sortByField(fieldName: string) {
  const BY_FIELD_NAME = ramda.ascend(ramda.compose(ramda.toLower, ramda.prop(fieldName)));
  return BY_FIELD_NAME;
}

export function uniqueMergedArray(firstArray: any, secondArray: any) {
  const MERGED = [];
  if (
    lodash.isArray(firstArray)
  ) {
    MERGED.push(...firstArray);
  }
  if (
    lodash.isArray(secondArray)
  ) {
    MERGED.push(...secondArray);
  }
  const RET_VAL = ramda.uniq(MERGED);
  return RET_VAL;
}
