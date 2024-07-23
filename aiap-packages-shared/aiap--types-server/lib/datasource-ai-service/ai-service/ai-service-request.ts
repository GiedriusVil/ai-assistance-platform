/*
  © Copyright IBM Corporation 2023. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import {
  AI_SERVICE_TYPE_ENUM,
} from './ai-service-type-enum';

export interface IAiServiceRequestV1 {
  type: AI_SERVICE_TYPE_ENUM,
  version: string,
  external:
  IAiServiceRequestExternalV1AwsLexV2 |
  IAiServiceRequestExternalV1ChatGptV3 |
  IAiServiceRequestExternalV1WaV1 |
  IAiServiceRequestExternalV1WaV2
  ,
}

export interface IAiServiceRequestExternalV1AwsLexV2 {
  botId: any,
  botAliasId: any,
  sessionId: any,
  localeId: any,
  text: any,
}

export interface IAiServiceRequestExternalV1ChatGptV3 {
  model: any,
  prompt: any,
  temperature: any,
  max_tokens: any,
  top_p: any,
  frequency_penalty: any,
  presence_penalty: any,
}

export interface IAiServiceRequestExternalV1WaV1 {
  workspaceId: any,
  input: {
    text: any,
  },
  headers: {
    'X-Watson-Metadata': {
      customer_id: any,
    }
  },
  context: {
    metadata: {
      user_id: any,
    }
  },
  alternateIntents?: boolean,
  intents?: Array<any>
}

export interface IAiServiceRequestExternalV1WaV2 {
  assistantId: any,
  input: {
    message_type: string,
    text: any,
    intents?: Array<any>,
    options?: {
      restart?: boolean,
      alternate_intents?: boolean,
      debug?: boolean,
    },
  },
  context?: IAiServiceRequestExternalContextV1WaV2,
}

export interface IAiServiceRequestExternalContextV1WaV2 {
  global?: any,
  skills?: any,
}
