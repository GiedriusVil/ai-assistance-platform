/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { IContextV1 } from '@ibm-aiap/aiap--types-server';

import { findManyByQuery } from './find-many-by-query';
//
import { deleteManyByIds } from './delete-many-by-ids';
import { findOneById } from './find-one-by-id';
import { findOneByKey } from './find-one-by-key';
import { saveOne } from './save-one';

import { LambdaModulesDatasourceMongoV1 } from '../';

import { 
  ISaveLambdaModuleConfigurationParamsV1,
  IFindLambdaModulesConfigurationsByQueryParamsV1,
  IFindLambdaModuleConfigurationByIdParamsV1,
  IDeleteLambdaModulesConfigurationsByIdsParamsV1,
  IFindLambdaModuleConfigurationByKeyParamsV1,
  IDeleteLambdaModuleConfigurationByIdParamsV1,
} from '../../types';

export const _modulesConfigurations = (datasource: LambdaModulesDatasourceMongoV1) => {
  const RET_VAL = {
    saveOne: async (
      context: IContextV1, 
      params: ISaveLambdaModuleConfigurationParamsV1) => {
        const TMP_RET_VAL = await saveOne(datasource, context, params);
        return TMP_RET_VAL;
    },
    findManyByQuery: async (
      context: IContextV1, 
      params: IFindLambdaModulesConfigurationsByQueryParamsV1) => {
        const TMP_RET_VAL = await findManyByQuery(datasource, context, params);
        return TMP_RET_VAL;
    },
    findOneById: async (
      context: IContextV1, 
      params: IFindLambdaModuleConfigurationByIdParamsV1) => {
        const TMP_RET_VAL = await findOneById(datasource, context, params);
        return TMP_RET_VAL;
    },
    deleteManyByIds: async (
      context: IContextV1, 
      params: IDeleteLambdaModulesConfigurationsByIdsParamsV1) => {
        const TMP_RET_VAL = await deleteManyByIds(datasource, context, params);
        return TMP_RET_VAL;
    },
    findOneByKey: async (
      context: IContextV1, 
      params: IFindLambdaModuleConfigurationByKeyParamsV1) => {
        const TMP_RET_VAL = await findOneByKey(datasource, context, params);
        return TMP_RET_VAL;
    },
    deleteOneById: async (
      context: IContextV1, 
      params: IDeleteLambdaModuleConfigurationByIdParamsV1): Promise<any> => { },
  };
  return RET_VAL;
};
