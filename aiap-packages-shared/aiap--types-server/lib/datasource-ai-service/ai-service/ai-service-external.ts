/*
  © Copyright IBM Corporation 2023. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
export interface IAiServiceExternalV1WaV1 {
  version: string,
  url: string,
  authType: string,
  username: string,
  password: string,
}

export interface IAiServiceExternalV1WaV2 {
  version: string,
  url: string,
  apiKey: string,
  assistantId?: string,
  environmentId?: string,
}

export interface IAiSericeExternalV1ChatGptV3 {
  organization: string,
  apiKey: string,
}

export interface IAiServiceExternalV1AwsLexV2 {
  region: any,
  accessKeyId: any,
  secretAccessKey: any,
}
