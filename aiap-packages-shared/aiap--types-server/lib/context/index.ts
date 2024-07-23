/*
  © Copyright IBM Corporation 2023. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import {
  IContextUserV1,
} from '../context-user';

export interface IContextV1 {
  user?: IContextUserV1,
  action?: {
    id?: string,
  },
}
