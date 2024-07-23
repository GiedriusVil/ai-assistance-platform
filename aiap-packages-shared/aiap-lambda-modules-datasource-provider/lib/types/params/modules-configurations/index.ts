/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import {
  IQuerySortV1,
  IQueryPaginationV1,
  ILambdaModuleConfigurationV1,
} from '@ibm-aiap/aiap--types-server';

export interface IFindLambdaModulesConfigurationsByQueryParamsV1 {
  filter?: {
    id?: any,
    assistantId?: any,
    dateRange?: any,
    search: string
  },
  type?: string,
  options?: any,
  sort: IQuerySortV1,
  pagination: IQueryPaginationV1,
};

export interface IFindLambdaModulesConfigurationsByQueryResponseV1 {
  items: Array<ILambdaModuleConfigurationV1>,
  total: number,
}

export interface IFindLambdaModuleConfigurationByIdParamsV1 {
  id: any,
};

export interface IFindLambdaModuleConfigurationByKeyParamsV1 {
  key: string,
};

export interface ISaveLambdaModuleConfigurationParamsV1 {
  value: ILambdaModuleConfigurationV1,
};

export interface IDeleteLambdaModulesConfigurationsByIdsParamsV1 {
  ids: Array<any>,
};

export interface IDeleteLambdaModulesConfigurationsByIdsResponseV1 {
  ids: Array<any>,
  status: string,
};

export interface IDeleteLambdaModuleConfigurationByIdParamsV1 {
  id: any,
};

export interface IDeleteLambdaModuleConfigurationByIdResponseV1 {

}

