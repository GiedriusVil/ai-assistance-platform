/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import {
  Graph,
} from '@maxgraph/core';

import {
  _debugX,
} from 'client-shared-utils';

export class MaxGraphBaseGraph extends Graph {

  static getClassName() {
    return 'MaxGraphBaseGraph';
  }

}
