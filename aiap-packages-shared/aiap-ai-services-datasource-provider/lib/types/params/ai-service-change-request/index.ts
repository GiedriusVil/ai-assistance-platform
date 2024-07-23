/*
  © Copyright IBM Corporation 2023. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import {
  IQuerySortV1,
  IQueryPaginationV1,
  IAiServiceChangeRequestV1,
  AI_SERVICE_TYPE_ENUM
} from '@ibm-aiap/aiap--types-server';

export interface IFindAiServicesChangeRequestByQueryParamsV1 {
  query: {
    filter: {
      id?: any,
      assistantId?: any,
      dateRange?: any,
    },
    sort: IQuerySortV1,
    pagination: IQueryPaginationV1,
  },
}

export interface IFindAiServiceChangeRequestByAiServiceAndAiSkillIdParamsV1 {
  value: {
    aiService?: {
      id?: string,
      name?: string,
      type?: AI_SERVICE_TYPE_ENUM,
      aiSkill?: {
        id: string,
        name: string,
        externalId:string
      }
    },
    intentName: string
  }
}

export interface IFindAiServiceChangeRequestByAiServiceAndAiSkillIdResponseV1 {
  items: Array<IAiServiceChangeRequestV1>,
}

export interface IFindAiServicesChangeRequestByQueryResponseV1 {
  items: Array<IAiServiceChangeRequestV1>,
  total: number,
}

export interface IDeleteAiServicesChangeRequestByIdsParamsV1 {
  ids: Array<any>,
}

export interface IDeleteAiServicesChangeRequestByIdsResponseV1 {
  ids: Array<any>,
  status: string,
}

export interface IFindAiServiceChangeRequestByIdParamsV1 {
  id: any,
}

export interface ISaveAiServiceChangeRequestParamsV1 {
  value: IAiServiceChangeRequestV1,
}
