/*
  © Copyright IBM Corporation 2023. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import {
  IChangesV1,
} from '@ibm-aiap/aiap--types-server';

import {
  ITenantV1,
} from '../tenant';

import {
  IAccessGroupV1View,
} from '../access-group-view';

export interface IAccessGroupV1 {
  id?: any,
  externalId?: any,
  name?: any,
  tenants?: Array<ITenantV1>,
  views?: Array<IAccessGroupV1View>,
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IAccessGroupV1Changes
  extends IChangesV1<IAccessGroupV1> {
}
