/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import {
  IContextUserSessionAccessGroupViewV1,
} from '../context-user';

import {
  IContextAssistantV1,
} from '../context-assistant';

export interface IContextApplicationV1 {
  id?: any,
  assistants?: Array<IContextAssistantV1>,
  views?: Array<IContextUserSessionAccessGroupViewV1>,
}
