/*
  © Copyright IBM Corporation 2023. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import {
  IQueryPaginationV1,
  IQuerySortV1,
  IEngagementV1
} from '@ibm-aiap/aiap--types-server'

export interface IFindEngagementsByQueryParamsV1 {
  isNotFullscreen?: any,
  filter: {
    dateRange: {
      from: string,
      to: string,
      mode: string,
    },
    search: string,
  },
  pagination: IQueryPaginationV1,
  options: any,
  type: string,
  sort: IQuerySortV1,
}

export interface IFindEngagementsByQueryResponseV1 {
  items: Array<any>,
  total: number,
}

export interface IFindEngagementLiteByIdParamsV1 {
  id: any,
}

export interface IFormatEngagementLiteResponseObject extends IEngagementV1 {
  _id: string;
}

export interface IDeleteEngagementsByIdsParamsV1 {
  ids: Array<any>,
}

export interface IDeleteEngagementsByIdsResponseV1 {
  ids: Array<any>,
  status: string,
}

export interface IFindEngagementByIdParamsV1 {
  id: any,
}

export interface ISaveEngagementParamsV1 {
  value: IEngagementV1,
}
