/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import {
  IContextV1,
} from '@ibm-aiap/aiap--types-server';

import {
  // types
  ITenantV1,
  // api
  IParamsV1FindTenantsByQuery,
  IResponseV1FindTenantsByQuery,
  IParamsV1DeleteTenantById,
  IResponseV1DeleteTenantById,
  IParamsV1FindTenantByExternalId,
  IParamsV1FindTenantByIdAndHash,
  IParamsV1FindTenantById,
  IParamsV1SaveTenant,
} from '@ibm-aiap/aiap--types-domain-app';

import {
  DatasourceAppV1Mongo,
} from '..';

import { findManyByQuery } from './find-many-by-query';
import { deleteOneById } from './delete-one-by-id';
import { findOneByExternalId } from './find-one-by-external-id';
import { findOneByIdAndHash } from './find-one-by-id-and-hash';
import { findOneById } from './find-one-by-id';
import { saveOne } from './save-one';

export const _tenants = (
  datasource: DatasourceAppV1Mongo,
) => {
  const RET_VAL = {
    findManyByQuery: async (
      context: IContextV1,
      params: IParamsV1FindTenantsByQuery,
    ): Promise<IResponseV1FindTenantsByQuery> => {
      const TMP_RET_VAL = await findManyByQuery(datasource, context, params);
      return TMP_RET_VAL;
    },
    deleteOneById: async (
      context: IContextV1,
      params: IParamsV1DeleteTenantById,
    ): Promise<IResponseV1DeleteTenantById> => {
      const TMP_RET_VAL = await deleteOneById(datasource, context, params);
      return TMP_RET_VAL;
    },
    findOneByExternalId: async (
      context: IContextV1,
      params: IParamsV1FindTenantByExternalId,
    ): Promise<ITenantV1> => {
      const TMP_RET_VAL = await findOneByExternalId(datasource, context, params);
      return TMP_RET_VAL;
    },
    findOneByIdAndHash: async (
      context: IContextV1,
      params: IParamsV1FindTenantByIdAndHash,
    ): Promise<ITenantV1> => {
      const TMP_RET_VAL = await findOneByIdAndHash(datasource, context, params);
      return TMP_RET_VAL;
    },
    findOneById: async (
      context: IContextV1,
      params: IParamsV1FindTenantById,
    ): Promise<ITenantV1> => {
      const TMP_RET_VAL = await findOneById(datasource, context, params);
      return TMP_RET_VAL;
    },
    saveOne: async (
      context: IContextV1,
      params: IParamsV1SaveTenant,
    ): Promise<ITenantV1> => {
      const TMP_RET_VAL = await saveOne(datasource, context, params);
      return TMP_RET_VAL;
    },
  };
  return RET_VAL;
}
