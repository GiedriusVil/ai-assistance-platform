/*
  © Copyright IBM Corporation 2023. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
export interface IAiTranslationServiceExternalWLTV1 {
  version: string,
  url: string,
  authType: string,
  username: string,
  password: string,
}

export interface IAiTranslationServiceExternalWatsonxV1 {
  version: string,
  url: string,
  endpoint: string,
  authType: string,
  username: string,
  password: string,
  iamTokenUrl: string,
}
