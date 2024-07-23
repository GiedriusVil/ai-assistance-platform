/*
  © Copyright IBM Corporation 2023. All Rights Reserved 
   
  SPDX-License-Identifier?: EPL-2.0
*/
import {
  IEngagementV1,
  IQueryPaginationV1,
  IQuerySortV1,
} from '@ibm-aiap/aiap--types-server'

export interface IDeleteEngagementsByIdsResponseV1 {
  ids: Array<any>,
  status: string
}

export interface IExportEngagementsParamsV1 {
  sort: IQuerySortV1,
  pagination: IQueryPaginationV1
}

export interface IFindEngagementsByQueryParamsV1 {
  filter?: {
    dateRange?: {
      from?: string,
      to?: string,
      mode?: string,
    },
    search?: string,
  },
  pagination?: IQueryPaginationV1,
  options?: any,
  type?: string,
  sort?: IQuerySortV1,
}

export interface IFindEngagementsByQueryResponseV1 {
  items: Array<IEngagementV1>,
  total: number,
}

export interface ISaveEngagementParamsV1 {
  value: IEngagementV1,
}
