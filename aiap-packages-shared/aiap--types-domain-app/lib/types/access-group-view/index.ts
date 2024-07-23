/*
  © Copyright IBM Corporation 2023. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import {
  IAccessGroupV1ViewAction,
} from '../access-group-view-action';

export interface IAccessGroupV1View {
  content?: any,
  name?: any,
  component?: any,
  selected?: any,
  actions?: Array<IAccessGroupV1ViewAction>,
}
