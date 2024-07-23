/*
  © Copyright IBM Corporation 2023. All Rights Reserved 
   
  SPDX-License-Identifier?: EPL-2.0
*/
import {
    CHANGE_ACTION,
    IEngagementChangeV1,
    IEngagementV1,
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
    items: Array<IEngagementChangeV1>,
    total: number,
}

export interface IFindEngagementChangeByIdParamsV1 {
    id: any,
}

export interface ISaveEngagementChangeParamsV1 {
    action: CHANGE_ACTION,
    value: IEngagementV1,
    docChanges?: any
}
