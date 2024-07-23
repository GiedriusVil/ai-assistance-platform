/*
  © Copyright IBM Corporation 2023. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import {
  ILambdaModuleV1,
  ILambdaModuleConfigurationV1,
  ILambdaModuleReleaseV1,
} from '@ibm-aiap/aiap--types-server';

import {
  IContextV1,
} from '@ibm-aiap/aiap--types-server';

import {
  IFindLambdaModuleByIdParamsV1,
  IFindLambdaModulesByQueryParamsV1,
  ISaveLambdaModuleParamsV1,
  IDeleteLambdaModuleByIdParamsV1,
  IDeleteLambdaModulesByIdsParamsV1,
  ISaveLambdaModuleConfigurationParamsV1,
  IFindLambdaModuleConfigurationByIdParamsV1,
  IDeleteLambdaModuleConfigurationByIdParamsV1,
  IDeleteLambdaModulesConfigurationsByIdsParamsV1,
  IFindLambdaModulesConfigurationsByQueryParamsV1,
  IFindLambdaModuleConfigurationByKeyParamsV1,
  IFindLambdaModulesByQueryResponseV1,
  IDeleteLambdaModulesConfigurationsByIdsResponseV1,
  IDeleteLambdaModulesByIdsResponseV1,
  IFindLambdaModulesConfigurationsByQueryResponseV1,
  IDeleteLambdaModuleByIdResponseV1,
  IDeleteLambdaModuleConfigurationByIdResponseV1,
  ISaveLambdaModuleReleaseParamsV1,
} from '../params';

export interface IDatasourceLambdaModulesV1 {
  get modules(): {
    findManyByQuery(
      context: IContextV1, 
      params: IFindLambdaModulesByQueryParamsV1): Promise<IFindLambdaModulesByQueryResponseV1>,
    findOneById(
      context: IContextV1, 
      params: IFindLambdaModuleByIdParamsV1): Promise<ILambdaModuleV1>,
    saveOne(
      context: IContextV1, 
      params: ISaveLambdaModuleParamsV1): Promise<ILambdaModuleV1>,
    deleteOneById(
      context: IContextV1, 
      params: IDeleteLambdaModuleByIdParamsV1): Promise<IDeleteLambdaModuleByIdResponseV1>,
    deleteManyByIds(
      context: IContextV1, 
      params: IDeleteLambdaModulesByIdsParamsV1): Promise<IDeleteLambdaModulesByIdsResponseV1>,
  };

  get modulesConfigurations(): {
    saveOne(
      context: IContextV1, 
      params: ISaveLambdaModuleConfigurationParamsV1): Promise<ILambdaModuleConfigurationV1>,
    findManyByQuery(
      context: IContextV1, 
      params: IFindLambdaModulesConfigurationsByQueryParamsV1): Promise<IFindLambdaModulesConfigurationsByQueryResponseV1>,
    findOneById(
      context: IContextV1, 
      params: IFindLambdaModuleConfigurationByIdParamsV1): Promise<ILambdaModuleConfigurationV1>,
    deleteManyByIds(
      context: IContextV1, 
      params: IDeleteLambdaModulesConfigurationsByIdsParamsV1): Promise<IDeleteLambdaModulesConfigurationsByIdsResponseV1>,
    findOneByKey(
      context: IContextV1, 
      params: IFindLambdaModuleConfigurationByKeyParamsV1): Promise<ILambdaModuleConfigurationV1>,
    deleteOneById(
      context: IContextV1, 
      params: IDeleteLambdaModuleConfigurationByIdParamsV1): Promise<IDeleteLambdaModuleConfigurationByIdResponseV1>,
  };


  get modulesReleases(): {
    saveOne(context: IContextV1, params: ISaveLambdaModuleReleaseParamsV1): Promise<ILambdaModuleReleaseV1>
  };
};
