/*
  © Copyright IBM Corporation 2023. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import {
  IQueryPaginationV1,
  IQuerySortV1,
  IAiServiceChangesV1,
} from '@ibm-aiap/aiap--types-server';

export interface IFindAiServiceChangesByQueryParamsV1 {
  query: {
    filter: {
      search?: any,
      dateRange?: any,
    },
    sort: IQuerySortV1,
    pagination: IQueryPaginationV1,
  }
}

export interface IFindAiServiceChangesByQueryResponseV1 {
  total: number,
  items: Array<IAiServiceChangesV1>,
}

export interface IFindAiServiceChangeByIdParamsV1 {
  id: any,
}

export interface ISaveAiServiceChangeParamsV1 {
  value: IAiServiceChangesV1,
}
