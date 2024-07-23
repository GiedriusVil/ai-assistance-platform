/*
  © Copyright IBM Corporation 2023. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import {
  IChangesV1,
} from '@ibm-aiap/aiap--types-server';

import {
  IApplicationV1,
} from '../application';

export interface ITenantV1 {
  id?: any,
  hash?: any,
  name?: any,
  environmentId: any,
  environment?: {
    id?: any,
  },
  objectStorage?: {
    id?: any,
    hash?: any,
    accessSecret: any,
    endPoint: any,
    port: any,
    accessKey: any,
    secretKey: any,
    useSSL: any,
  },
  applications?: Array<IApplicationV1>,
  redisClients?: Array<any>,
  eventStreams?: Array<any>,
  dbClients?: Array<any>,
  _datasources?: Array<any>,
  external?: {
    id?: any,
  }
}
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ITenantV1Changes
  extends IChangesV1<ITenantV1> {
  //
}
