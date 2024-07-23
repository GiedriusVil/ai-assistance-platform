/*
   © Copyright IBM Corporation 2022. All Rights Reserved 
    
   SPDX-License-Identifier: EPL-2.0
*/
import {
  IContextV1,
  IAiSkillV1,
} from '@ibm-aiap/aiap--types-server';

import {
  IFindAiSkillsByActionTagIdParamsV1,
  IFindAiSkillsByActionTagIdResponseV1,
  IFindAiSkillsByAnswerKeyParamsV1,
  IFindAiSkillsByAnswerKeyResponseV1,
  IFindAiSkillsByQueryParamsV1,
  IFindAiSkillsByQueryResponseV1,
  IFindAiSkillsLiteByQueryParamsV1,
  IFindAISkillsLiteByQueryResponseV1,
  IDeleteAiSkillsByIdsParamsV1,
  IDeleteAiSkillsByIdsResponseV1,
  IDeleteAiSkillByIdParamsV1,
  IDeleteAiSkillByIdResponseV1,
  IFindAiSkillByAiServiceIdAndNameParamsV1,
  IFindAiSkillByIdParamsV1,
  ISaveAiSkillParamsV1,
} from '../../types/params/ai-skills';

import {
  AiServicesDatasourceMongoV1,
} from '..';

import { findManyByActionTagId } from './find-many-by-action-tag-id';
import { findManyByAnswerKey } from './find-many-by-answer-key';
import { findManyByQuery } from './find-many-by-query';
import { findManyLiteByQuery } from './find-many-lite-by-query';
import { deleteManyByIds } from './delete-many-by-ids';
import { deleteOneById } from './delete-one-by-id';
import { findOneByAiServiceIdAndName } from './find-one-by-ai-service-id-and-name';
import { findOneById } from './find-one-by-id';
import { saveOne } from './save-one';

export const _aiSkills = (
  datasource: AiServicesDatasourceMongoV1,
) => {
  const RET_VAL = {
    findManyByActionTagId: async (
      context: IContextV1,
      params: IFindAiSkillsByActionTagIdParamsV1,
    ): Promise<IFindAiSkillsByActionTagIdResponseV1> => {
      const TMP_RET_VAL = await findManyByActionTagId(datasource, context, params);
      return TMP_RET_VAL;
    },
    findManyByAnswerKey: async (
      context: IContextV1,
      params: IFindAiSkillsByAnswerKeyParamsV1,
    ): Promise<IFindAiSkillsByAnswerKeyResponseV1> => {
      const TMP_RET_VAL = await findManyByAnswerKey(datasource, context, params);
      return TMP_RET_VAL;
    },
    findManyByQuery: async (
      context: IContextV1,
      params: IFindAiSkillsByQueryParamsV1,
    ): Promise<IFindAiSkillsByQueryResponseV1> => {
      const TMP_RET_VAL = await findManyByQuery(datasource, context, params);
      return TMP_RET_VAL;
    },
    findManyLiteByQuery: async (
      context: IContextV1,
      params: IFindAiSkillsLiteByQueryParamsV1,
    ): Promise<IFindAISkillsLiteByQueryResponseV1> => {
      const TMP_RET_VAL = await findManyLiteByQuery(datasource, context, params);
      return TMP_RET_VAL;
    },
    deleteManyByIds: async (
      context: IContextV1,
      params: IDeleteAiSkillsByIdsParamsV1,
    ): Promise<IDeleteAiSkillsByIdsResponseV1> => {
      const TMP_RET_VAL = await deleteManyByIds(datasource, context, params);
      return TMP_RET_VAL;
    },
    deleteOneById: async (
      context: IContextV1,
      params: IDeleteAiSkillByIdParamsV1,
    ): Promise<IDeleteAiSkillByIdResponseV1> => {
      const TMP_RET_VAL = await deleteOneById(datasource, context, params);
      return TMP_RET_VAL;
    },
    findOneByAiServiceIdAndName: async (
      context: IContextV1,
      params: IFindAiSkillByAiServiceIdAndNameParamsV1,
    ): Promise<IAiSkillV1> => {
      const TMP_RET_VAL = await findOneByAiServiceIdAndName(datasource, context, params);
      return TMP_RET_VAL;
    },
    findOneById: async (
      context: IContextV1,
      params: IFindAiSkillByIdParamsV1,
    ): Promise<IAiSkillV1> => {
      const TMP_RET_VAL = await findOneById(datasource, context, params);
      return TMP_RET_VAL;
    },
    saveOne: async (
      context: IContextV1,
      params: ISaveAiSkillParamsV1,
    ): Promise<IAiSkillV1> => {
      const TMP_RET_VAL = await saveOne(datasource, context, params);
      return TMP_RET_VAL;
    },
  };
  return RET_VAL;
}
