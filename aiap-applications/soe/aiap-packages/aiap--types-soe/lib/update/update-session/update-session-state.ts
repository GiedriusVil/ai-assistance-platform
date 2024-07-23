/*
  © Copyright IBM Corporation 2023. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
export interface ISoeUpdateSessionStateV1 {
  awsLexV2?: ISoeUpdateSessionStateV1AwsLexV2,
  chatGptV3?: ISoeUpdateSessionStateV1ChatGptV3,
  ibmWaV1?: ISoeUpdateSessionStateV1IbmWaV1,
  ibmWaV2?: {
    [aiServiceId: string]: ISoeUpdateSessionStateV1IbmWaV2,
  },
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ISoeUpdateSessionStateV1ChatGptV3 {

}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ISoeUpdateSessionStateV1AwsLexV2 {

}

export interface ISoeUpdateSessionStateV1IbmWaV1 {
  system: any,
  metadata: any,
  conversation_id: any,
}

export interface ISoeUpdateSessionStateV1IbmWaV2 {
  global: any,
  skills: {
    user_defined: any,
  },
  debug: any,
}
