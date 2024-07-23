/*
  © Copyright IBM Corporation 2023. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/

import {
  AI_SERVICE_TYPE_ENUM,
} from '..';


export interface IAiServiceChangeRequestV1 {
  id: string,
  utteranceId?: string,
  intents: Array<any>,
  aiService: {
    id: string,
    name: string, c
    type: AI_SERVICE_TYPE_ENUM,
    aiSkill: {
      id: string,
      name: string,
      externalId?: string
    }
  }
}
