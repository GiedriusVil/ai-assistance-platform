/*
  © Copyright IBM Corporation 2023. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import {
  IContextUserSessionV1,
} from './context-user-session';

export interface IContextUserV1 {
  id?: string,
  type?: string,
  username?: string,
  company?: {
    id?: any,
  },
  accessGroupIds?: Array<string>,
  session?: IContextUserSessionV1,
  lastSession?: IContextUserSessionV1,
  timezone?: any,
  token?: {
    access?: any,
    accessExpiry?: any,
    refresh?: any,
  },
}
