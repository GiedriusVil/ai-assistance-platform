/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import {
  AI_SERVICE_TYPE_ENUM,
} from '../ai-service';

export interface IAiLogRecordV1 {
  type: AI_SERVICE_TYPE_ENUM,
  external:
  IAiLogRecordExternalV1AwsLexV2 |
  IAiLogRecordExternalV1ChatGptV3 |
  IAiLogRecordExternalV1V1WaV1 |
  IAiLogRecordExternalV1V1WaV2,
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IAiLogRecordExternalV1AwsLexV2 {

}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IAiLogRecordExternalV1ChatGptV3 {

}

export interface IAiLogRecordExternalV1V1WaV1 {
  log_id: any,
  request: {
    input: {
      text: any,
    }
  },
  response: {
    output: {
      text: any,
      nodes_visited: any,
    },
    intents: Array<any>,
    entities: Array<any>,
    context: {
      conversation_id: any,
      metadata: {
        user_id: any,
      }
    }
  },
  request_timestamp: any,
  response_timestamp: any,
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IAiLogRecordExternalV1V1WaV2 {

}




