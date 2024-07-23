/*
  © Copyright IBM Corporation 2023. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import {
  IContextTenantV1,
} from '../context-tenant';

import {
  IContextApplicationV1,
} from '../context-application';

import {
  IContextUserSessionAccessGroupV1,
} from './context-user-session-access-group';

export interface IContextUserSessionV1 {
  tenant?: IContextTenantV1,
  tenants?: Array<IContextTenantV1>,
  application?: IContextApplicationV1,
  accessGroup?: IContextUserSessionAccessGroupV1,
  account?: {
    pullAccount?: {
      id: any,
    }
  }
}
