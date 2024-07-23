/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import {
  IContextV1,
} from '@ibm-aiap/aiap--types-server';

import {
  // types
  ITenantV1Changes,
  // api
  IParamsV1FindTenantV1ChangesByQuery,
  IResponseV1FindTenantV1ChangesByQuery,
  IParamsV1FindTenantV1ChangesById,
  IParamsV1SaveTenantV1Changes,
} from '@ibm-aiap/aiap--types-domain-app';

import {
  DatasourceAppV1Mongo,
} from '..';

import { findManyByQuery } from './find-many-by-query';
import { findOneById } from './find-one-by-id';
import { saveOne } from './save-one';

export const _tenantsChanges = (
  datasource: DatasourceAppV1Mongo,
) => {
  const RET_VAL = {
    findManyByQuery: async (
      context: IContextV1,
      params: IParamsV1FindTenantV1ChangesByQuery,
    ): Promise<IResponseV1FindTenantV1ChangesByQuery> => {
      const TMP_RET_VAL = await findManyByQuery(datasource, context, params);
      return TMP_RET_VAL;
    },
    findOneById: async (
      context: IContextV1,
      params: IParamsV1FindTenantV1ChangesById,
    ): Promise<ITenantV1Changes> => {
      const TMP_RET_VAL = await findOneById(datasource, context, params);
      return TMP_RET_VAL;
    },
    saveOne: async (
      context: IContextV1,
      params: IParamsV1SaveTenantV1Changes,
    ): Promise<ITenantV1Changes> => {
      const TMP_RET_VAL = await saveOne(datasource, context, params);
      return TMP_RET_VAL;
    },
  };
  return RET_VAL;
}
