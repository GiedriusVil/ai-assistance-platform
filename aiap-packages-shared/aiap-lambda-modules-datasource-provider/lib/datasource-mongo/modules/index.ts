/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { IContextV1 } from '@ibm-aiap/aiap--types-server';

import { findManyByQuery } from './find-many-by-query';
//
import { deleteManyByIds } from './delete-many-by-ids';
import { deleteOneById } from './delete-one-by-id';
import { findOneById } from './find-one-by-id';
import { saveOne } from './save-one';

import { LambdaModulesDatasourceMongoV1 } from '../';

import {
  IFindLambdaModulesByQueryParamsV1,
  IFindLambdaModuleByIdParamsV1,
  ISaveLambdaModuleParamsV1,
  IDeleteLambdaModuleByIdParamsV1,
  IDeleteLambdaModulesByIdsParamsV1,
} from '../../types';

export const _modules = (datasource: LambdaModulesDatasourceMongoV1) => {
  const RET_VAL = {
    findManyByQuery: async (
      context: IContextV1, 
      params: IFindLambdaModulesByQueryParamsV1) => {
        const TMP_RET_VAL = await findManyByQuery(datasource, context, params);
        return TMP_RET_VAL;
    },
    findOneById: async (
      context: IContextV1, 
      params: IFindLambdaModuleByIdParamsV1) => {
        const TMP_RET_VAL = await findOneById(datasource, context, params);
        return TMP_RET_VAL;
    },
    saveOne: async (
      context: IContextV1, 
      params: ISaveLambdaModuleParamsV1) => {
        const TMP_RET_VAL = await saveOne(datasource, context, params);
        return TMP_RET_VAL;
    },
    deleteOneById: async (
      context: IContextV1, 
      params: IDeleteLambdaModuleByIdParamsV1) => {
        const TMP_RET_VAL = await deleteOneById(datasource, context, params);
        return TMP_RET_VAL;
    },
    deleteManyByIds: async (
      context: IContextV1, 
      params: IDeleteLambdaModulesByIdsParamsV1) => {
        const TMP_RET_VAL = await deleteManyByIds(datasource, context, params);
        return TMP_RET_VAL;
    },
  };
  return RET_VAL;
}
