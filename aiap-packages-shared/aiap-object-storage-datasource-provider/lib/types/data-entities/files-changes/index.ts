/*
  © Copyright IBM Corporation 2023. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import {
  IChangesV1,
} from '@ibm-aiap/aiap--types-server';

import {
  IFileV1,
} from '../files';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IFileChangesV1 extends IChangesV1<IFileV1> {
  //
}
