/*
  © Copyright IBM Corporation 2023. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import {
  IQuerySortV1,
  IQueryPaginationV1,
  IAiServiceV1,
} from '@ibm-aiap/aiap--types-server';

export interface IFindAiServicesByQueryParamsV1 {
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

export interface IFindAiServicesByQueryResponseV1 {
  items: Array<IAiServiceV1>,
  total: number,
}

export interface IDeleteAiServicesByIdsParamsV1 {
  ids: Array<any>,
}

export interface IDeleteAiServicesByIdsResponseV1 {
  ids: Array<any>,
  status: string,
}

export interface IFindAiServiceByIdParamsV1 {
  id: any,
}

export interface IFindAiServiceByNameParamsV1 {
  name: any,
}

export interface ISaveAiServiceParamsV1 {
  value: IAiServiceV1,
}
