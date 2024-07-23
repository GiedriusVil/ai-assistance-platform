/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import {
  IAiSkillV1,
  IAiEntityV1,
} from '@ibm-aiap/aiap--types-server';

export interface IRetrieveAiEntitiesByQueryParamsV1 {
  query: {
    filter: {
      aiSkill: IAiSkillV1,
    },
  },
}

export interface IRetrieveAiEntitiesByQueryResponseV1 {
  items: Array<IAiEntityV1>,
}

export interface IRetrieveAiEntitiesByQueryWithValuesParamsV1 {
  query: {
    filter: {
      aiSkill: IAiSkillV1,
    },
  },
}

export interface IRetrieveAiEntitiesByQueryWithValuesResponseV1 {
  items: Array<IAiEntityV1>,
}

export interface ISynchroniseAiEntitiesWithinAiSkillParamsV1 {
  aiSkill: IAiSkillV1,
}
