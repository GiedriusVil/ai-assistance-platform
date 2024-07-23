/*
  © Copyright IBM Corporation 2023. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import {
  IContextTenantV1,
} from '../context-tenant';

import {
  IContextUserSessionAccessGroupViewV1,
} from './context-user-session-access-group-view';

export interface IContextUserSessionAccessGroupV1 {
  tenants?: Array<IContextTenantV1>,
  views?: Array<IContextUserSessionAccessGroupViewV1>,
}
