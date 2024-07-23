/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import {
  IQuerySortV1,
  IQueryPaginationV1,
  ILambdaModuleReleaseV1,
} from '@ibm-aiap/aiap--types-server';

export interface ISaveLambdaModuleReleaseParamsV1 {
  value: ILambdaModuleReleaseV1,
};
