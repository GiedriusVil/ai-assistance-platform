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
  AiServiceClientV1AwsLexV2,
} from '..';

import { retrieveManyByQuery } from './retrieve-many-by-query';

export const _skills = (
  client: AiServiceClientV1AwsLexV2,
) => {
  const RET_VAL = {
    saveOne: async (
      context: IContextV1,
      params: ISaveAiSkillParamsV1,
    ): Promise<ISaveAiSkillResponseV1> => {
      const TMP_RET_VAL = null;
      return TMP_RET_VAL;
    },
    checkManyByIdsForStatusAvailable: async (
      context: IContextV1,
      params: ICheckAiSkillsByIdsForStatusAvailableParamsV1,
    ): Promise<ICheckAiSkillsByIdsForStatusAvailableResponseV1> => {
      const TMP_RET_VAL = null;
      return TMP_RET_VAL;
    },
    checkOneByIdForStatusAvailable: async (
      context: IContextV1,
      params: ICheckAiSkillByIdForStatusAvailableParamsV1,
    ): Promise<ICheckAiSkillByIdForStatusAvailableResponseV1> => {
      const TMP_RET_VAL = null;
      return TMP_RET_VAL;
    },
    countManyByQuery: async (
      context: IContextV1,
      params: ICountAiSkillsByQueryParamsV1,
    ): Promise<ICountAiSkillsByQueryResponseV1> => {
      const TMP_RET_VAL = null;
      return TMP_RET_VAL;
    },
    deleteManyByIds: async (
      context: IContextV1,
      params: IDeleteAiSkillsByIdsParamsV1,
    ): Promise<IDeleteAiSkillsByIdsResponseV1> => {
      const TMP_RET_VAL = null;
      return TMP_RET_VAL;
    },
    deleteOneById: async (
      context: IContextV1,
      params: IDeleteAiSkillByIdParamsV1,
    ): Promise<IDeleteAiSkillByIdResponseV1> => {
      const TMP_RET_VAL = null;
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
      const TMP_RET_VAL = null;
      return TMP_RET_VAL;
    },
    syncOne: async (
      context: IContextV1,
      params: ISynchroniseAiSkillParamsV1,
    ): Promise<IAiSkillV1> => {
      const TMP_RET_VAL = null;
      return TMP_RET_VAL;
    },
  };
  return RET_VAL;
}
