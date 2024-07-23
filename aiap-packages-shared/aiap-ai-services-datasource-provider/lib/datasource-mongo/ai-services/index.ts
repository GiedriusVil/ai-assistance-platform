/*
   © Copyright IBM Corporation 2022. All Rights Reserved 
    
   SPDX-License-Identifier: EPL-2.0
*/
import {
  IContextV1,
  IAiServiceV1,
} from '@ibm-aiap/aiap--types-server';

import {
  IFindAiServicesByQueryParamsV1,
  IFindAiServicesByQueryResponseV1,
  IDeleteAiServicesByIdsParamsV1,
  IDeleteAiServicesByIdsResponseV1,
  IFindAiServiceByIdParamsV1,
  IFindAiServiceByNameParamsV1,
  ISaveAiServiceParamsV1,
} from '../../types/params/ai-services';

import {
  AiServicesDatasourceMongoV1,
} from '..';

import { findManyByQuery } from './find-many-by-query';
import { deleteManyByIds } from './delete-many-by-ids';
import { findOneById } from './find-one-by-id';
import { findOneByName } from './find-one-by-name';
import { saveOne } from './save-one';

export const _aiServices = (
  datasource: AiServicesDatasourceMongoV1,
) => {
  const RET_VAL = {
    findManyByQuery: async (
      context: IContextV1,
      params: IFindAiServicesByQueryParamsV1,
    ): Promise<IFindAiServicesByQueryResponseV1> => {
      const TMP_RET_VAL = await findManyByQuery(datasource, context, params);
      return TMP_RET_VAL;
    },
    deleteManyByIds: async (
      context: IContextV1,
      params: IDeleteAiServicesByIdsParamsV1,
    ): Promise<IDeleteAiServicesByIdsResponseV1> => {
      const TMP_RET_VAL = await deleteManyByIds(datasource, context, params);
      return TMP_RET_VAL;
    },
    findOneById: async (
      context: IContextV1,
      params: IFindAiServiceByIdParamsV1,
    ): Promise<IAiServiceV1> => {
      const TMP_RET_VAL = await findOneById(datasource, context, params);
      return TMP_RET_VAL;
    },
    findOneByName: async (
      context: IContextV1,
      params: IFindAiServiceByNameParamsV1,
    ): Promise<IAiServiceV1> => {
      const TMP_RET_VAL = await findOneByName(datasource, context, params);
      return TMP_RET_VAL;
    },
    saveOne: async (
      context: IContextV1,
      params: ISaveAiServiceParamsV1,
    ): Promise<IAiServiceV1> => {
      const TMP_RET_VAL = await saveOne(datasource, context, params);
      return TMP_RET_VAL;
    },
  };
  return RET_VAL;
}
