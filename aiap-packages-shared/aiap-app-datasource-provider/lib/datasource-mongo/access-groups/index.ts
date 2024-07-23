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
  IAccessGroupV1,
  // api-access-groups
  IParamsV1FindAccessGroupsByQuery,
  IResponseV1FindAccessGroupsByQuery,
  IParamsV1FindAccessGroupsLiteByQuery,
  IResponseV1FindAccessGroupsLiteByQuery,
  IParamsV1DeleteAccessGroupByIdAndUpdateUsers,
  IResponseV1DeleteAccessGroupByIdAndUpdateUsers,
  IParamsV1DeleteAccessGroupById,
  IResponseV1DeleteAccessGroupById,
  IParamsV1FindAccessGroupById,
  IParamsV1FindAccessGroupByName,
  IParamsV1SaveAccessGroup,
} from '@ibm-aiap/aiap--types-domain-app';

import { findManyByQuery } from './find-many-by-query';
import { findManyLiteByQuery } from './find-many-lite-by-query';
import { deleteOneByIdAndUpdateUsers } from './delete-one-by-id-and-update-users';
import { deleteOneById } from './delete-one-by-id';
import { findOneById } from './find-one-by-id';
import { findOneByName } from './find-one-by-name';
import { saveOne } from './save-one';

export const _accessGroups = (
  datasource: DatasourceAppV1Mongo,
) => {
  const RET_VAL = {
    findManyByQuery: async (
      context: IContextV1,
      params: IParamsV1FindAccessGroupsByQuery,
    ): Promise<IResponseV1FindAccessGroupsByQuery> => {
      const TMP_RET_VAL = await findManyByQuery(datasource, context, params);
      return TMP_RET_VAL;
    },
    findManyLiteByQuery: async (
      context: IContextV1,
      params: IParamsV1FindAccessGroupsLiteByQuery,
    ): Promise<IResponseV1FindAccessGroupsLiteByQuery> => {
      const TMP_RET_VAL = await findManyLiteByQuery(datasource, context, params);
      return TMP_RET_VAL;
    },
    deleteOneByIdAndUpdateUsers: async (
      context: IContextV1,
      params: IParamsV1DeleteAccessGroupByIdAndUpdateUsers,
    ): Promise<IResponseV1DeleteAccessGroupByIdAndUpdateUsers> => {
      const TMP_RET_VAL = await deleteOneByIdAndUpdateUsers(datasource, context, params);
      return TMP_RET_VAL;
    },
    deleteOneById: async (
      context: IContextV1,
      params: IParamsV1DeleteAccessGroupById,
    ): Promise<IResponseV1DeleteAccessGroupById> => {
      const TMP_RET_VAL = await deleteOneById(datasource, context, params);
      return TMP_RET_VAL;
    },
    findOneById: async (
      context: IContextV1,
      params: IParamsV1FindAccessGroupById,
    ): Promise<IAccessGroupV1> => {
      const TMP_RET_VAL = await findOneById(datasource, context, params);
      return TMP_RET_VAL;
    },
    findOneByName: async (
      context: IContextV1,
      params: IParamsV1FindAccessGroupByName,
    ): Promise<IAccessGroupV1> => {
      const TMP_RET_VAL = await findOneByName(datasource, context, params);
      return TMP_RET_VAL;
    },
    saveOne: async (
      context: IContextV1,
      params: IParamsV1SaveAccessGroup,
    ): Promise<IAccessGroupV1> => {
      const TMP_RET_VAL = await saveOne(datasource, context, params);
      return TMP_RET_VAL;
    },
  };
  return RET_VAL;
}
