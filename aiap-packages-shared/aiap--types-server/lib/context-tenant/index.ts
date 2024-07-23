/*
  © Copyright IBM Corporation 2023. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import {
  IContextApplicationV1,
} from '../context-application';

export interface IContextTenantV1 {
  id?: any,
  hash?: any,
  name?: any,
  environment?: {
    id?: any,
  },
  objectStorage?: {
    accessSecret: any,
  },
  applications?: Array<IContextApplicationV1>,
  _datasources?: any,
  soeBaseUrl?: string,
  chatAppBaseUrl?: string,
  tenantCustomizerBaseUrl?: string,
  external?: {
    id?: any,
  }
}
