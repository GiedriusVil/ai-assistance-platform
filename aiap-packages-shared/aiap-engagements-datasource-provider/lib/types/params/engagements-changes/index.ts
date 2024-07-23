/*
  © Copyright IBM Corporation 2023. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import {
  IEngagementChangeV1,
  IQueryPaginationV1,
  IQuerySortV1
} from '@ibm-aiap/aiap--types-server'

export interface IFindEngagementsChangesByQueryParamsV1 {
  filter?: {
    dateRange: {
      from: string,
      to: string,
      mode: string
    },
    search: string,
  },
  pagination: IQueryPaginationV1,
  options?: any,
  type?: string,
  sort: IQuerySortV1
}

export interface IFindEngagementsChangesByQueryResponseV1 {
  items: Array<any>,
  total: number,
}

export interface IFindEngagementChangeByIdParamsV1 {
  id: any,
}

export interface ISaveEngagementChangeParamsV1 {
  value: IEngagementChangeV1
}
