/*
  © Copyright IBM Corporation 2023. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import {
  IQuerySortV1,
  IQueryPaginationV1,
  IAiSkillReleaseV1,
} from '@ibm-aiap/aiap--types-server';

export interface IFindAiSkillReleasesByQueryParamsV1 {
  query: {
    filter: {
      aiServiceId: any,
      aiSkillId: any,
    },
    sort: IQuerySortV1,
    pagination: IQueryPaginationV1,
  },
}

export interface IFindAiSkillReleasesByQueryResponseV1 {
  items: Array<IAiSkillReleaseV1>,
  total: number,
}

export interface IFindAiSkillReleasesLiteByQueryParamsV1 {
  query: {
    filter: {
      aiServiceId: any,
      aiSkillId: any,
    },
    sort: IQuerySortV1,
    pagination: IQueryPaginationV1,
  },
}

export interface IFindAiSkillReleasesLiteByQueryResponseV1 {
  items: Array<any>,
  total: number,
}

export interface IDeleteAiSkillReleasesByIdsParamsV1 {
  ids: any,
}

export interface IDeleteAiSkillReleasesByIdsResponseV1 {
  ids: any,
  status: any,
}

export interface IDeleteAiSkillReleaseByIdParamsV1 {
  id: any,
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IDeleteAiSkillReleaseByIdResponseV1 {

}

export interface IFindAiSkillReleaseByIdParamsV1 {
  id: any,
}


export interface ISaveAiSkillReleaseParamsV1 {
  value: IAiSkillReleaseV1,
}
