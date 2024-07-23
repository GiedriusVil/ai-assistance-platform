/*
   © Copyright IBM Corporation 2022. All Rights Reserved 
    
   SPDX-License-Identifier: EPL-2.0
*/
import {
  IContextV1,
  IAiSkillV1,
} from '@ibm-aiap/aiap--types-server';

import {
  IRetrieveAiSkillsByQueryParamsV1,
  IRetrieveAiSkillsByQueryResponseV1,
  ISaveAiSkillResponseV1,
  ISaveAiSkillParamsV1,
  ICheckAiSkillsByIdsForStatusAvailableResponseV1,
  ICheckAiSkillsByIdsForStatusAvailableParamsV1,
  ICheckAiSkillByIdForStatusAvailableParamsV1,
  ICheckAiSkillByIdForStatusAvailableResponseV1,
  ICountAiSkillsByQueryResponseV1,
  ICountAiSkillsByQueryParamsV1,
  IDeleteAiSkillsByIdsParamsV1,
  IDeleteAiSkillsByIdsResponseV1,
  IDeleteAiSkillByIdResponseV1,
  IDeleteAiSkillByIdParamsV1,
  IRetrieveAiSkillByIdParamsV1,
  IRetrieveAiSkillByIdResponseV1,
  ISynchroniseAiSkillParamsV1,
} from '../../types';

import {
  AiServiceClientV1WaV1,
} from '..';

import { saveOne } from './save-one';
import { checkManyByIdsForStatusAvailable } from './check-many-by-ids-for-status-avaibale';
import { checkOneByIdForStatusAvailable } from './check-one-by-id-for-status-avaibale';
import { countManyByQuery } from './count-many-by-query';
import { deleteManyByIds } from './delete-many-by-ids';
import { deleteOneById } from './delete-one-by-id';
import { retrieveManyByQuery } from './retrieve-many-by-query';
import { retrieveOneById } from './retrieve-one-by-id';
import { syncOne } from './sync-one';

export const _skills = (
  client: AiServiceClientV1WaV1,
) => {
  const RET_VAL = {
    saveOne: async (
      context: IContextV1,
      params: ISaveAiSkillParamsV1,
    ): Promise<ISaveAiSkillResponseV1> => {
      const TMP_RET_VAL = await saveOne(client, context, params);
      return TMP_RET_VAL;
    },
    checkManyByIdsForStatusAvailable: async (
      context: IContextV1,
      params: ICheckAiSkillsByIdsForStatusAvailableParamsV1,
    ): Promise<ICheckAiSkillsByIdsForStatusAvailableResponseV1> => {
      const TMP_RET_VAL = await checkManyByIdsForStatusAvailable(client, context, params)
      return TMP_RET_VAL;
    },
    checkOneByIdForStatusAvailable: async (
      context: IContextV1,
      params: ICheckAiSkillByIdForStatusAvailableParamsV1,
    ): Promise<ICheckAiSkillByIdForStatusAvailableResponseV1> => {
      const TMP_RET_VAL = await checkOneByIdForStatusAvailable(client, context, params);
      return TMP_RET_VAL;
    },
    countManyByQuery: async (
      context: IContextV1,
      params: ICountAiSkillsByQueryParamsV1,
    ): Promise<ICountAiSkillsByQueryResponseV1> => {
      const TMP_RET_VAL = await countManyByQuery(client, context, params);
      return TMP_RET_VAL;
    },
    deleteManyByIds: async (
      context: IContextV1,
      params: IDeleteAiSkillsByIdsParamsV1,
    ): Promise<IDeleteAiSkillsByIdsResponseV1> => {
      const TMP_RET_VAL = await deleteManyByIds(client, context, params);
      return TMP_RET_VAL;
    },
    deleteOneById: async (
      context: IContextV1,
      params: IDeleteAiSkillByIdParamsV1,
    ): Promise<IDeleteAiSkillByIdResponseV1> => {
      const TMP_RET_VAL = await deleteOneById(client, context, params);
      return TMP_RET_VAL;
    },
    retrieveManyByQuery: async (
      context: IContextV1,
      params: IRetrieveAiSkillsByQueryParamsV1,
    ): Promise<IRetrieveAiSkillsByQueryResponseV1> => {
      const TMP_RET_VAL = await retrieveManyByQuery(client, context, params);
      return TMP_RET_VAL;
    },
    retrieveOneById: async (
      context: IContextV1,
      params: IRetrieveAiSkillByIdParamsV1,
    ): Promise<IRetrieveAiSkillByIdResponseV1> => {
      const TMP_RET_VAL = await retrieveOneById(client, context, params);
      return TMP_RET_VAL;
    },
    syncOne: async (
      context: IContextV1,
      params: ISynchroniseAiSkillParamsV1,
    ): Promise<IAiSkillV1> => {
      const TMP_RET_VAL = await syncOne(client, context, params);
      return TMP_RET_VAL;
    },
  };
  return RET_VAL;
}
