/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import {
  AI_SERVICE_TYPE_ENUM,
} from '../ai-service';

export interface IAiEntityV1 {
  type: AI_SERVICE_TYPE_ENUM,
  external:
  IAiEntityExternalV1ChatGptV3 |
  IAiEntityExternalAwsLexV2 |
  IAiEntityExternalV1WaV1 |
  IAiEntityExternalV1WaV2,
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IAiEntityExternalAwsLexV2 {

}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IAiEntityExternalV1ChatGptV3 {

}

export interface IAiEntityExternalV1WaV1 {
  entity?: string,
  created: any,
  updated: any,
  values: Array<{
    value?: string,
    type?: string,
    patterns?: Array<any>,
    synonyms?: Array<any>,
  }>,
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IAiEntityExternalV1WaV2 {

}
