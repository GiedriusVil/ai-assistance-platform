/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import {
  IContextV1,
} from '@ibm-aiap/aiap--types-server';

import {
  DatasourceAppV1Mongo,
} from '..';

import {
  // types
  IApplicationV1,
  // api
  IParamsV1FindApplicationsByQuery,
  IResponseV1FindApplicationsByQuery,
  IParamsV1DeleteApplicationsByIds,
  IResponseV1DeleteApplicationsByIds,
  IParamsV1FindApplicationsByTenantId,
  IParamsV1FindApplicationById,
  IParamsV1SaveApplication,
} from '@ibm-aiap/aiap--types-domain-app';

import { findManyByQuery } from './find-many-by-query';
import { deleteManyByIds } from './delete-many-by-ids';
import { findManyByTenantId } from './find-many-by-tenant-id';
import { findOneById } from './find-one-by-id';
import { saveOne } from './save-one';

export const _applications = (
  datasource: DatasourceAppV1Mongo,
) => {
  const RET_VAL = {
    findManyByQuery: async (
      context: IContextV1,
      params: IParamsV1FindApplicationsByQuery,
    ): Promise<IResponseV1FindApplicationsByQuery> => {
      const TMP_RET_VAL = await findManyByQuery(datasource, context, params);
      return TMP_RET_VAL;
    },
    deleteManyByIds: async (
      context: IContextV1,
      params: IParamsV1DeleteApplicationsByIds,
    ): Promise<IResponseV1DeleteApplicationsByIds> => {
      const TMP_RET_VAL = await deleteManyByIds(datasource, context, params);
      return TMP_RET_VAL;
    },
    findManyByTenantId: async (
      context: IContextV1,
      params: IParamsV1FindApplicationsByTenantId,
    ): Promise<Array<IApplicationV1>> => {
      const TMP_RET_VAL = await findManyByTenantId(datasource, context, params);
      return TMP_RET_VAL;
    },
    findOneById: async (
      context: IContextV1,
      params: IParamsV1FindApplicationById,
    ): Promise<IApplicationV1> => {
      const TMP_RET_VAL = await findOneById(datasource, context, params);
      return TMP_RET_VAL;
    },
    saveOne: async (
      context: IContextV1,
      params: IParamsV1SaveApplication,
    ): Promise<IApplicationV1> => {
      const TMP_RET_VAL = await saveOne(datasource, context, params);
      return TMP_RET_VAL;
    },
  };
  return RET_VAL;
}
