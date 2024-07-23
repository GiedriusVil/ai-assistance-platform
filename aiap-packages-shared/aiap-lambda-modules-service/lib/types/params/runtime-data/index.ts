/*
  © Copyright IBM Corporation 2024. All Rights Reserved 
   
  SPDX-License-Identifier?: EPL-2.0
*/
import {
  ILambdaModuleConfigurationV1,
  ILambdaModuleV1,
  IQueryPaginationV1,
  IQuerySortV1,
} from '@ibm-aiap/aiap--types-server';

export interface ISynchronizeWithConfigDirectoryConfigurationParamsV1 {
  moduleConfig: ILambdaModuleConfigurationV1
}

export interface ISynchronizeWithConfigDirectoryModuleParamsV1 {
  value: ILambdaModuleV1,
}
