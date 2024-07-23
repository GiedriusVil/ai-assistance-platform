/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import {
  AI_SERVICE_TYPE_ENUM,
} from '../ai-service';

export interface IAiIntentV1 {
  type: AI_SERVICE_TYPE_ENUM,
  external:
  IAiIntentExternalAwsLexV2 |
  IAiIntentExternalV1ChatGptV3 |
  IAiIntentExternalV1WaV1 |
  IAiIntentExternalV1WaV2,
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IAiIntentExternalAwsLexV2 {

}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IAiIntentExternalV1ChatGptV3 {

}

export interface IAiIntentExternalV1WaV1 {
  intent: any,
  examples: Array<any>,
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IAiIntentExternalV1WaV2 {

}




