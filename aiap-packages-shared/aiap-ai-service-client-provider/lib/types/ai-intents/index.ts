/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import {
  IAiSkillV1,
  IAiIntentV1,
} from '@ibm-aiap/aiap--types-server';

export interface IRetrieveAiIntentsByQueryParamsV1 {
  query: {
    filter: {
      aiSkill: IAiSkillV1,
    },
  },
}

export interface IRetrieveAiIntentsByQueryResponseV1 {
  items: Array<IAiIntentV1>,
}

export interface IRetrieveAiIntentsByQueryWithExamplesParamsV1 {
  query: {
    filter: {
      aiSkill: IAiSkillV1,
    },
  },
}

export interface IRetrieveAiIntentsByQueryWithExamplesResponseV1 {
  items: Array<IAiIntentV1>,
}

export interface ISynchroniseAiIntentsWithinAiSkillParamsV1 {
  aiSkill: IAiSkillV1,
}
