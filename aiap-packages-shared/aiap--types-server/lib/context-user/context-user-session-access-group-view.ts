/*
  © Copyright IBM Corporation 2023. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import {
  IContextUserSessionAccessGroupViewActionV1,
} from './context-user-session-access-group-view-action';

export interface IContextUserSessionAccessGroupViewV1 {
  name?: any,
  component?: any,
  actions?: Array<IContextUserSessionAccessGroupViewActionV1>,
}
