/*
  © Copyright IBM Corporation 2023. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import {
  IQuerySortV1,
  IQueryPaginationV1,
  IAiServiceTestV1,
} from '@ibm-aiap/aiap--types-server';

export interface IFindAiServiceTestClassificationReportsByQueryParamsV1 {
  query: {
    filter: {
      id: any,
    },
    sort: IQuerySortV1,
    pagination: IQueryPaginationV1,
  },
}

export interface IFindAiServiceTestClassificationReportsByQueryResponseV1 {
  items: Array<any>,
  total: number,
}

export interface IFindAiServiceIncorrectIntentsByQueryParamsV1 {
  query: {
    filter: {
      id: any,
    },
    sort: IQuerySortV1,
    pagination: IQueryPaginationV1,
  }
}

export interface IFindAiServiceIncorrectIntentsByQueryResponseV1 {
  items: Array<any>,
  total: number,
}

export interface IFindAiServiceTestsByQueryParamsV1 {
  query: {
    filter: {
      id: any,
      testName: any,
      dateRange: any,
    },
    sort: IQuerySortV1,
    pagination: IQueryPaginationV1,
  }
}

export interface IFindAiServiceTestsByQueryResponseV1 {
  items: Array<IAiServiceTestV1>,
  total: number,
}

export interface IFindAiServiceTestsLiteByQueryParamsV1 {
  query: {
    filter: {
      testId: any,
      testName: any,
      dateRange: any,
    },
    sort: IQuerySortV1,
    pagination: IQueryPaginationV1,
  }
}

export interface IFindAiServiceTestsByLiteQueryResponseV1 {
  items: Array<any>,
  total: number,
}

export interface IFindAiServiceTestsResultsByQueryParamsV1 {
  query: {
    filter: {
      id: any,
    },
    sort: IQuerySortV1,
    pagination: IQueryPaginationV1,
  }
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IFindAiServiceTestsResultsByQueryResponseV1 {

}

export interface IDeleteAiServiceTestByIdParamsV1 {
  id: any,
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IDeleteAiServiceTestByIdResponseV1 {

}

export interface IFindAiServiceTestByIdParamsV1 {
  id: any,
}

export interface ISaveAiServiceTestParamsV1 {
  value: IAiServiceTestV1,
}
