/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import * as lodash from 'lodash';

import { _debugX } from 'client-shared-utils';

export function executeRequestWithExponentialBackoff(request: Function, stateItem: any, params: any = {}, maxLoops: number = 3, loop: number = 1): void {
  if (request) {
    _debugX('RequestUtils', 'executeRequestWithExponentialBackoff', { request, stateItem, params, loop });

    let timeout: number = loop;

    request(params);

    setTimeout(() => {
      timeout *= 2;
      loop += 1;

      if (!stateItem && loop <= maxLoops) {
        executeRequestWithExponentialBackoff(request, stateItem, params, maxLoops, loop);
      }
    }, (timeout * 1000));
  }
}
