/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import {
  IQueryPaginationV1,
  IAiSkillV1,
  IAiDialogNodeV1,
} from '@ibm-aiap/aiap--types-server';

export interface IRetrieveAiDialogNodesByQueryParamsV1 {
  query: {
    filter: {
      aiSkill: IAiSkillV1,
    },
    pagination: IQueryPaginationV1,
  }
}

export interface IRetrieveAiDialogNodesByQueryResponseV1 {
  items: Array<IAiDialogNodeV1>,
}

export interface ISynchroniseAiDialogNodesWithinAiSkillParamsV1 {
  aiSkill: IAiSkillV1,
}
