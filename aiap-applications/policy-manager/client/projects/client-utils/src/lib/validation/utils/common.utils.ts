/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Observable, of } from "rxjs";

import { _error } from 'client-shared-utils';

export function handleError(notificationService: any, error: any, msg: any): Observable<void> {
  _error(`[ACA] [ERROR] ${error}`, error);
  // notificationService.showNotification(msg);
  return of();
}

/** Returns comparator with specified field name by which ascending sorting will be done */
// export function sortByField(fieldName: string) {
//   const BY_FIELD_NAME:any = ramda.ascend(ramda.compose(ramda.toLower, ramda.prop(fieldName)));
//   return BY_FIELD_NAME;
// }
