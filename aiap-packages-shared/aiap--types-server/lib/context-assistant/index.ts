/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import {
  IContextUserSessionAccessGroupViewV1,
} from '../context-user';

export interface IContextAssistantV1 {
  id?: any,
  name?: any,
  views?: Array<IContextUserSessionAccessGroupViewV1>,
}
