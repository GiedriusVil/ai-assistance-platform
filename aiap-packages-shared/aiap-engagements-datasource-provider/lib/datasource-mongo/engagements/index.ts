/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { IContextV1, IEngagementV1 } from '@ibm-aiap/aiap--types-server';

import { findManyByQuery } from './find-many-by-query';
import { findOneLiteById } from './find-one-lite-by-id';

//
import { deleteManyByIds } from './delete-many-by-ids';
import { findOneById } from './find-one-by-id';
import { saveOne } from './save-one';

import { EngagementsDatasourceMongo } from '..';

import {
  IDeleteEngagementsByIdsParamsV1,
  IDeleteEngagementsByIdsResponseV1,
  IFindEngagementByIdParamsV1,
  IFindEngagementLiteByIdParamsV1,
  IFindEngagementsByQueryParamsV1,
  IFindEngagementsByQueryResponseV1,
  ISaveEngagementParamsV1
} from '../../types';

export const _engagements = (
  datasource: EngagementsDatasourceMongo,
) => {
  const RET_VAL = {
    findOneLiteById: async (
      context: IContextV1,
      params: IFindEngagementLiteByIdParamsV1,
    ): Promise<IEngagementV1> => {
      const TMP_RET_VAL = await findOneLiteById(datasource, context, params);
      return TMP_RET_VAL;
    },
    findManyByQuery: async (
      context: IContextV1,
      params: IFindEngagementsByQueryParamsV1,
    ): Promise<IFindEngagementsByQueryResponseV1> => {
      const TMP_RET_VAL = await findManyByQuery(datasource, context, params);
      return TMP_RET_VAL;
    },
    deleteManyByIds: async (
      context: IContextV1,
      params: IDeleteEngagementsByIdsParamsV1,
    ): Promise<IDeleteEngagementsByIdsResponseV1> => {
      const TMP_RET_VAL = await deleteManyByIds(datasource, context, params);
      return TMP_RET_VAL;
    },
    findOneById: async (
      context: IContextV1,
      params: IFindEngagementByIdParamsV1,
    ): Promise<IEngagementV1> => {
      const TMP_RET_VAL = await findOneById(datasource, context, params);
      return TMP_RET_VAL;
    },
    saveOne: async (
      context: IContextV1,
      params: ISaveEngagementParamsV1,
    ): Promise<IEngagementV1> => {
      const TMP_RET_VAL = await saveOne(datasource, context, params);
      return TMP_RET_VAL;
    },
  };
  return RET_VAL;
}
