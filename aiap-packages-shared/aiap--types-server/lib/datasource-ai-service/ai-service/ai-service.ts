/*
  © Copyright IBM Corporation 2023. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import {
  IAiSkillV1,
} from '../ai-skill';

import {
  IAiServiceExternalV1AwsLexV2,
  IAiSericeExternalV1ChatGptV3,
  IAiServiceExternalV1WaV1,
  IAiServiceExternalV1WaV2,
} from './ai-service-external';

import {
  AI_SERVICE_TYPE_ENUM,
} from './ai-service-type-enum';

export interface IAiServiceV1 {
  id?: string,
  type?: AI_SERVICE_TYPE_ENUM,
  version?: string,
  name?: string,
  external?:
  IAiServiceExternalV1AwsLexV2 |
  IAiSericeExternalV1ChatGptV3 |
  IAiServiceExternalV1WaV1 |
  IAiServiceExternalV1WaV2,
  // transient attributes
  aiServiceId?: string, // Temporary solution
  aiSkillId?: string, // Temporary solution
  aiSkill?: IAiSkillV1,
  rate?: any,
  intents?: any,
  pullConfiguration?: {
    tenantId: any,
    assistantId: any,
    aiServiceId: any,
  }
}
