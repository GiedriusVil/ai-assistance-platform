/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import {
  IContextV1,
  IAiServiceChangesV1,
} from '@ibm-aiap/aiap--types-server';

import {
  AiServicesDatasourceMongoV1,
} from '..';

import {
  IFindAiServiceChangesByQueryParamsV1,
  IFindAiServiceChangesByQueryResponseV1,
  IFindAiServiceChangeByIdParamsV1,
  ISaveAiServiceChangeParamsV1,
} from '../../types';

import { findManyByQuery } from './find-many-by-query';
import { findOneById } from './find-one-by-id';
import { saveOne } from './save-one';


export const _aiServicesChanges = (
  datasource: AiServicesDatasourceMongoV1,
) => {
  const RET_VAL = {
    findManyByQuery: async (
      context: IContextV1,
      params: IFindAiServiceChangesByQueryParamsV1,
    ): Promise<IFindAiServiceChangesByQueryResponseV1> => {
      const TMP_RET_VAL = await findManyByQuery(datasource, context, params);
      return TMP_RET_VAL;
    },
    findOneById: async (
      context: IContextV1,
      params: IFindAiServiceChangeByIdParamsV1,
    ): Promise<IAiServiceChangesV1> => {
      const TMP_RET_VAL = await findOneById(datasource, context, params);
      return TMP_RET_VAL;
    },
    saveOne: async (
      context: IContextV1,
      params: ISaveAiServiceChangeParamsV1,
    ): Promise<IAiServiceChangesV1> => {
      const TMP_RET_VAL = await saveOne(datasource, context, params);
      return TMP_RET_VAL;
    },
  };
  return RET_VAL;
}
