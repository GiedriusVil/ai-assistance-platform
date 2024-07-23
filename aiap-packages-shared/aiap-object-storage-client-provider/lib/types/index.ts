/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/

export interface IObjectStorageClientConfigurationV1 {
  id: string,
  type: string,
  name: string,
  hash: string,
}

export interface IObjectStorageClientConfigurationMinioV1 extends IObjectStorageClientConfigurationV1 {
  endPoint: string;
  port?: number;
  accessKey: string;
  secretKey: string;
  useSSL?: boolean;
}
