/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/

import {
  IAccessGroupV1View,
} from '../access-group-view';

export interface IAssistantV1 {
  id?: any,
  views?: Array<IAccessGroupV1View>,
}
