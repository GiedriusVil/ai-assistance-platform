/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'policy-manager-client-components-utils-utils';
import { Observable, of } from "rxjs";

import * as lodash from 'lodash';
import * as ramda from 'ramda';

import {
  _errorX,
} from 'client-shared-utils';

export function handleError(notificationService, error, msg): Observable<void> {
  _errorX(MODULE_ID, 'handleError',
    {
      error
    });

  notificationService.showNotification(msg);
  return of();
}


/** Returns comparator with specified field name by which ascending sorting will be done */
export function sortByField(fieldName: string) {
  const BY_FIELD_NAME = ramda.ascend(ramda.compose(ramda.toLower, ramda.prop(fieldName)));
  return BY_FIELD_NAME;
}

export function isAnArray(value: string) {
  let retVal;

  try {
    const PARSED_VALUE = JSON.parse(value);
    retVal = lodash.isArray(PARSED_VALUE);
  } catch (error) {
    retVal = false;
  }

  return retVal;
}
