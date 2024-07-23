/*
  © Copyright IBM Corporation 2023. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/

import {
  IAiServiceRequestV1,
  IAiServiceResponseV1,
} from '@ibm-aiap/aiap--types-server';


interface IUtteranceShadowV1 {
  id: string,
  conversationId: string,
  timestamp: Date,
  topIntent: string,
  request: {
    message?: {
      text?: string
    }
  },
  skillName: string,
  dialogNodes: any,
  response: {
    [key: string | number | symbol]: any,
  },
  metricsTracker: any,
  tenantId: string,
  context: any,
  assistantId: string,
  aiServiceRequest: IAiServiceRequestV1,
  aiServiceResponse: IAiServiceResponseV1,
}

export {
  IUtteranceShadowV1,
}
