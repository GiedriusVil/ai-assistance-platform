/*
  © Copyright IBM Corporation 2023. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import {
  AI_SERVICE_TYPE_ENUM,
} from './ai-service-type-enum';

export interface IAiServiceResponseV1 {
  type: AI_SERVICE_TYPE_ENUM,
  version: string,
  external:
  IAiServiceResponseExternalV1AwsLexV2 |
  IAiServiceResponseExternalV1ChatGptV3 |
  IAiServiceResponseExternalV1WaV1 |
  IAiServiceResponseExternalV1WaV2,
}

export interface IAiServiceResponseExternalV1AwsLexV2 {
  metadata: any,
  messages: Array<any>,
  interpretations: any,
  result: {
    context: {
      skills: {
        user_defined: any,
      }
    },
    output: {
      debug: any,
      intents: any,
    }
  }
  [key: string | number | symbol]: any,
}

export interface IAiServiceResponseExternalV1ChatGptV3 {
  headers: any,
  data: {
    choices: Array<{
      text: any,
    }>,
  },
}

export interface IAiServiceResponseExternalV1WaV1 {
  headers: any,
  result: {
    intents: any,
    context: {
      system: any,
      metadata: any,
      conversation_id: any,

    },
    output: {
      text: any | Array<any>,
      generic: Array<{
        response_type: any,
        text: any,
      }>
    }
  },
}


export interface IAiServiceResponseExternalV1WaV2 {
  headers: any,
  result: {
    output: {
      generic: any,
      intents: any,
      debug: any,
    },
    context: {
      skills: {
        'main skill': {
          user_defined: any,
        },
        'actions skill': {
          skill_variables: any,
        }
      }
    };
  },
}
