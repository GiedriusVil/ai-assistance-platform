/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import {
  IContextV1,
  IAiServiceChangeRequestV1
} from '@ibm-aiap/aiap--types-server';

import {
  AiServicesDatasourceMongoV1,
} from '..';

import {
  IFindAiServicesChangeRequestByQueryParamsV1,
  IFindAiServicesChangeRequestByQueryResponseV1,
  IDeleteAiServicesChangeRequestByIdsParamsV1,
  IDeleteAiServicesChangeRequestByIdsResponseV1,
  IFindAiServiceChangeRequestByIdParamsV1,
  ISaveAiServiceChangeRequestParamsV1,
  IFindAiServiceChangeRequestByAiServiceAndAiSkillIdResponseV1,
  IFindAiServiceChangeRequestByAiServiceAndAiSkillIdParamsV1
} from '../../types';

import { findManyByQuery } from './find-many-by-query';
import { deleteManyByIds } from './delete-many-by-ids';
import { findOneById } from './find-one-by-id';
import { saveOne } from './save-one';
import { findOneByAiServiceAndAiSkillId } from './find-one-by-ai-service-and-ai-skill-id';


export const _aiServicesChangeRequest = (
  datasource: AiServicesDatasourceMongoV1,
) => {
  const RET_VAL = {
    deleteManyByIds: async (
      context: IContextV1,
      params: IDeleteAiServicesChangeRequestByIdsParamsV1,
    ): Promise<IDeleteAiServicesChangeRequestByIdsResponseV1> => {
      const TMP_RET_VAL = await deleteManyByIds(datasource, context, params);
      return TMP_RET_VAL;
    },
    saveOne: async (
      context: IContextV1,
      params: ISaveAiServiceChangeRequestParamsV1,
    ): Promise<IAiServiceChangeRequestV1> => {
      const TMP_RET_VAL = await saveOne(datasource, context, params);
      return TMP_RET_VAL;
    },
    findManyByQuery: async (
      context: IContextV1,
      params: IFindAiServicesChangeRequestByQueryParamsV1,
    ): Promise<IFindAiServicesChangeRequestByQueryResponseV1> => {
      const TMP_RET_VAL = await findManyByQuery(datasource, context, params);
      return TMP_RET_VAL;
    },
    findOneById: async (
      context: IContextV1,
      params: IFindAiServiceChangeRequestByIdParamsV1,
    ): Promise<IAiServiceChangeRequestV1> => {
      const TMP_RET_VAL = await findOneById(datasource, context, params);
      return TMP_RET_VAL;
    },
    findOneByAiServiceAndAiSkillId: async (
      context: IContextV1,
      params: IFindAiServiceChangeRequestByAiServiceAndAiSkillIdParamsV1,
    ): Promise<IFindAiServiceChangeRequestByAiServiceAndAiSkillIdResponseV1> => {
      const TMP_RET_VAL = await findOneByAiServiceAndAiSkillId(datasource, context, params);
      return TMP_RET_VAL;
    },
  };
  return RET_VAL;
}
