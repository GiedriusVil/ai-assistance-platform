/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import {
  IQuerySortV1,
  IQueryPaginationV1,
  ILambdaModuleV1,
} from '@ibm-aiap/aiap--types-server';

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

export interface IFindLambdaModulesByQueryResponseV1 {
  items: Array<ILambdaModuleV1>,
  total: number,
}

export interface IFindLambdaModuleByIdParamsV1 {
  id: any,
};

export interface ISaveLambdaModuleParamsV1 {
  value: ILambdaModuleV1,
}
export interface IDeleteLambdaModulesByIdsParamsV1 {
  ids: Array<any>,
}

export interface IDeleteLambdaModulesByIdsResponseV1 {
  ids: Array<any>,
  status: string,
}


export interface IDeleteLambdaModuleByIdResponseV1 {

}

export interface IDeleteLambdaModuleByIdParamsV1 {
  id: any,
}
