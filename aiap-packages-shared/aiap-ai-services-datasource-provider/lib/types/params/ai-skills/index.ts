/*
  © Copyright IBM Corporation 2023. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import {
  IAiSkillV1, IQueryPaginationV1, IQuerySortV1,
} from '@ibm-aiap/aiap--types-server'

export interface IFindAiSkillsByActionTagIdParamsV1 {
  moduleId: any,
}

export interface IFindAiSkillsByActionTagIdResponseV1 {
  skills: Array<IAiSkillV1>,
}

export interface IFindAiSkillsByAnswerKeyParamsV1 {
  answerKey: any,
}

export interface IFindAiSkillsByAnswerKeyResponseV1 {
  skills: Array<IAiSkillV1>,
  count: number,
}

export interface IFindAiSkillsByQueryParamsV1 {
  query: {
    filter?: {
      search?: any,
      aiServiceId?: any,
      dateRange?: any,
    },
    sort?: IQuerySortV1,
    pagination: IQueryPaginationV1,
  },
}

export interface IFindAiSkillsByQueryResponseV1 {
  items: Array<IAiSkillV1>,
  total: number,
}

export interface IFindAiSkillsLiteByQueryParamsV1 {
  query: {
    filter: {
      aiServiceId?: any,
      dateRange?: any,
    },
    sort?: IQuerySortV1,
    pagination: IQueryPaginationV1,
  },
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IFindAISkillsLiteByQueryResponseV1 {
  items: Array<any>,
  total: number,
}

export interface IDeleteAiSkillsByIdsParamsV1 {
  ids: Array<any>,
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IDeleteAiSkillsByIdsResponseV1 {

}

export interface IDeleteAiSkillByIdParamsV1 {
  id: any,
}

export interface IDeleteAiSkillByIdResponseV1 {
  status: string,
}

export interface IFindAiSkillByAiServiceIdAndNameParamsV1 {
  aiServiceId: any,
  name: any,
}

export interface IFindAiSkillByIdParamsV1 {
  id: any,
}


export interface ISaveAiSkillParamsV1 {
  value: IAiSkillV1,
}
