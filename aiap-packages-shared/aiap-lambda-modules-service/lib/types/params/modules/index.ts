/*
  © Copyright IBM Corporation 2024. All Rights Reserved 
   
  SPDX-License-Identifier?: EPL-2.0
*/
import {
  ILambdaModuleV1,
  IQueryPaginationV1,
  IQuerySortV1,
} from '@ibm-aiap/aiap--types-server';



export interface IDeleteLambdaModulesByIdsResponseV1 {
  ids: Array<any>,
  status: string
};

export interface ICompileLambdaModulesCodeParams {
  assistantId?: string,
  code: string,
  created?: {
    user: { 
      id: string, 
      name: string 
    },
    date: string
  },
  type?: string,
  updated?: {
    user: { 
      id: string, 
      name: string 
    },
    date: string
  },
  id?: string
};

export interface ILambdaModulesGetApplicationUrl {
  code: string,
  created: {
    user: { 
      id: string, 
      name: string 
    },
    date: string
  },
  type: string,
  updated: {
    user: { 
      id: string, 
      name: string 
    },
    date: string
  },
  id: string
};

export interface IDeleteLambdaModulesByIdsParamsV1 {
  ids: Array<any>,
};

export interface IDeleteLambdaModuleByIdParamsV1 {
  id: any,
}

export interface IExportLambdaModulesParamsV1 {
  sort: { 
    field: string, 
    direction: string, 
  },
  pagination: { page: string, size: string },
  ids: any[],
}

export interface IFindLambdaModuleByIdParamsV1 {
  id: any,
};

export interface IFindLambdaModulesByQueryParamsV1 {
  filter?: {
    id?: any,
    assistantId?: any,
    dateRange?: any,
    search: string,
  },
  type?: string,
  options?: string,
  sort: IQuerySortV1,
  pagination: IQueryPaginationV1,
  ids?: string[],
};

export interface IFindLambdaModuleByIdParamsV1 {
  id: any,
};

export interface ISaveLambdaModuleParamsV1 {
  value: ILambdaModuleV1,
}
