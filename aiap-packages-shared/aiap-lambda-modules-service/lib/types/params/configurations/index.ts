/*
  © Copyright IBM Corporation 2024. All Rights Reserved 
   
  SPDX-License-Identifier?: EPL-2.0
*/
import {
  ILambdaModuleConfigurationV1,
  IQueryPaginationV1,
  IQuerySortV1,
} from '@ibm-aiap/aiap--types-server';


export interface IDeleteLambdaModulesConfigurationsByIdsResponseV1 {
  ids: Array<any>,
  status: string,
}

export interface IExportLambdaModulesConfigurationsParamsV1 {
  sort: IQuerySortV1,
  pagination: IQueryPaginationV1,
}

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

export interface IFindLambdaModuleConfigurationByIdParamsV1 {
  id: any,
};

export interface ISaveLambdaModuleConfigurationParamsV1 {
  value: ILambdaModuleConfigurationV1,
};
