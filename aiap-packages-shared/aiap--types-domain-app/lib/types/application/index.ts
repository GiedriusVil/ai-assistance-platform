/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import {
  IChangesV1,
} from '@ibm-aiap/aiap--types-server';

import {
  IAccessGroupV1View,
} from '../access-group-view';

import {
  IAssistantV1,
} from '../assistant';

export interface IApplicationV1 {
  id?: any,
  assistants?: Array<IAssistantV1>,
  views?: Array<IAccessGroupV1View>,
  enabled?: boolean,
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IApplicationV1Changes
  extends IChangesV1<IApplicationV1> {
}
