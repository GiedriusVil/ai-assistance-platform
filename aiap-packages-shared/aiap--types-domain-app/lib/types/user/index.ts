/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import {
  IChangesV1,
} from '@ibm-aiap/aiap--types-server';

import {
  ITenantV1,
} from '../tenant';

export interface IUserV1 {
  id?: any,
  type?: string,
  username?: any,
  password?: any,
  passwordLastSet?: number,
  token?: any,
  tenants?: Array<ITenantV1>,
  deniedLoginAttempts?: any,
  lastLoginDenial?: any,
  userStatus?: any,
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IUserV1Changes
  extends IChangesV1<IUserV1> {

}
