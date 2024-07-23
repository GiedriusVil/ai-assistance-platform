/*
   © Copyright IBM Corporation 2022. All Rights Reserved 
    
   SPDX-License-Identifier: EPL-2.0
*/
import {
  IAiSkillReleaseV1,
  IContextV1,
} from '@ibm-aiap/aiap--types-server';

import {
  IFindAiSkillReleasesByQueryParamsV1,
  IFindAiSkillReleasesByQueryResponseV1,
  IFindAiSkillReleasesLiteByQueryParamsV1,
  IFindAiSkillReleasesLiteByQueryResponseV1,
  IDeleteAiSkillReleasesByIdsParamsV1,
  IDeleteAiSkillReleasesByIdsResponseV1,
  IDeleteAiSkillReleaseByIdParamsV1,
  IDeleteAiSkillReleaseByIdResponseV1,
  IFindAiSkillReleaseByIdParamsV1,
  ISaveAiSkillReleaseParamsV1,
} from '../../types';

import {
  AiServicesDatasourceMongoV1,
} from '..';

import { findManyByQuery } from './find-many-by-query';
import { findManyLiteByQuery } from './find-many-lite-by-query';
import { deleteManyByIds } from './delete-many-by-ids';
import { deleteOneById } from './delete-one-by-id';
import { findOneById } from './find-one-by-id';
import { saveOne } from './save-one';

export const _aiSkillReleases = (
  datasource: AiServicesDatasourceMongoV1,
) => {
  const RET_VAL = {
    findManyByQuery: async (
      context: IContextV1,
      params: IFindAiSkillReleasesByQueryParamsV1,
    ): Promise<IFindAiSkillReleasesByQueryResponseV1> => {
      const TMP_RET_VAL = await findManyByQuery(datasource, context, params);
      return TMP_RET_VAL;
    },
    findManyLiteByQuery: async (
      context: IContextV1,
      params: IFindAiSkillReleasesLiteByQueryParamsV1,
    ): Promise<IFindAiSkillReleasesLiteByQueryResponseV1> => {
      const TMP_RET_VAL = await findManyLiteByQuery(datasource, context, params);
      return TMP_RET_VAL;
    },
    deleteManyByIds: async (
      context: IContextV1,
      params: IDeleteAiSkillReleasesByIdsParamsV1,
    ): Promise<IDeleteAiSkillReleasesByIdsResponseV1> => {
      const TMP_RET_VAL = await deleteManyByIds(datasource, context, params);
      return TMP_RET_VAL;
    },
    deleteOneById: async (
      context: IContextV1,
      params: IDeleteAiSkillReleaseByIdParamsV1,
    ): Promise<IDeleteAiSkillReleaseByIdResponseV1> => {
      const TMP_RET_VAL = await deleteOneById(datasource, context, params);
      return TMP_RET_VAL;
    },
    findOneById: async (
      context: IContextV1,
      params: IFindAiSkillReleaseByIdParamsV1,
    ): Promise<IAiSkillReleaseV1> => {
      const TMP_RET_VAL = await findOneById(datasource, context, params);
      return TMP_RET_VAL;
    },
    saveOne: async (
      context: IContextV1,
      params: ISaveAiSkillReleaseParamsV1,
    ): Promise<IAiSkillReleaseV1> => {
      const TMP_RET_VAL = await saveOne(datasource, context, params);
      return TMP_RET_VAL;
    },
  };
  return RET_VAL;
}
