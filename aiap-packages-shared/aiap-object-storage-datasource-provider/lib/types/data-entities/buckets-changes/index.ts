/*
  © Copyright IBM Corporation 2023. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import {
  IChangesV1,
} from '@ibm-aiap/aiap--types-server';

import {
  IBucketV1,
} from '../buckets';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IBucketChangesV1 extends IChangesV1<IBucketV1> {
  //
}
