/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { findManyByQuery } from './find-many-by-query';

//
import { findOneById } from './find-one-by-id';
import { saveOne } from './save-one';

import {
  IContextV1,
  IEngagementChangeV1
} from '@ibm-aiap/aiap--types-server';

import {
  EngagementsDatasourceMongo
} from '..';

import {
  IFindEngagementChangeByIdParamsV1,
  IFindEngagementsChangesByQueryParamsV1,
  IFindEngagementsChangesByQueryResponseV1,
  ISaveEngagementChangeParamsV1
} from '../../types';

export const _engagementsChanges = (
  datasource: EngagementsDatasourceMongo,
) => {
  const RET_VAL = {
    findManyByQuery: async (
      context: IContextV1,
      params: IFindEngagementsChangesByQueryParamsV1,
    ): Promise<IFindEngagementsChangesByQueryResponseV1> => {
      const TMP_RET_VAL = await findManyByQuery(datasource, context, params);
      return TMP_RET_VAL;
    },
    findOneById: async (
      context: IContextV1,
      params: IFindEngagementChangeByIdParamsV1,
    ): Promise<IEngagementChangeV1> => {
      const TMP_RET_VAL = await findOneById(datasource, context, params);
      return TMP_RET_VAL;
    },
    saveOne: async (
      context: IContextV1,
      params: ISaveEngagementChangeParamsV1,
    ): Promise<IEngagementChangeV1> => {
      const TMP_RET_VAL = await saveOne(datasource, context, params);
      return TMP_RET_VAL;
    },
  };
  return RET_VAL;
}
