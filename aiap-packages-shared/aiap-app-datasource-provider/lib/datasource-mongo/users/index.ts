/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import {
  IContextV1,
} from '@ibm-aiap/aiap--types-server';

import {
  // types
  IUserV1,
  // api
  IParamsV1FindUsersByQuery,
  IResponseV1FindUsersByQuery,
  IParamsV1FindUsersLiteByQuery,
  IResponseV1FindUsersLiteByQuery,
  IParamsV1SaveUser,
  IParamsV1CreateUser,
  IParamsV1DeleteUserById,
  IResponseV1DeleteUserById,
  IParamsV1FindUserById,
  IParamsV1FindUserByUsername,
  IParamsV1UpdateUserLastLoginTimeById,
  IResponseV1UpdateUserLastLoginTimeById,
  IParamsV1UpdateUserLastSession,
  IResponseV1UpdateUserLastSession,
  IParamsV1UpdateUserToken,
  IResponseV1UpdateUserToken,
  IParamsV1UpdateUser,
} from '@ibm-aiap/aiap--types-domain-app';

import {
  DatasourceAppV1Mongo,
} from '..';

import { ensureDefaults } from './ensure-defaults';
import { findManyByQuery } from './find-many-by-query';
import { findManyLiteByQuery } from './find-many-lite-by-query';
import { saveOne } from './save-one';
import { createOne } from './create-one';
import { deleteOneById } from './delete-one-by-id';
import { findOneById } from './find-one-by-id';
import { findOneByUserName } from './find-one-by-username';
import { updateOneLastLoginTimeById } from './update-one-last-login-time-by-id';
import { updateOneLastSessionById } from './update-one-last-session-by-id';
import { updateOneToken } from './update-one-token';
import { updateOne } from './update-one';

export const _users = (
  datasource: DatasourceAppV1Mongo,
) => {
  const RET_VAL = {
    ensureDefaults: async (
      context: IContextV1,
      params: {
        users: {
          [key: string]: {
            username: any,
            password: any,
            accessGroupId: any,
          }
        },
      },
    ): Promise<void> => {
      const TMP_RET_VAL = await ensureDefaults(datasource, context, params);
      return TMP_RET_VAL;
    },
    findManyByQuery: async (
      context: IContextV1,
      params: IParamsV1FindUsersByQuery,
    ): Promise<IResponseV1FindUsersByQuery> => {
      const TMP_RET_VAL = await findManyByQuery(datasource, context, params);
      return TMP_RET_VAL;
    },
    findManyLiteByQuery: async (
      context: IContextV1,
      params: IParamsV1FindUsersLiteByQuery,
    ): Promise<IResponseV1FindUsersLiteByQuery> => {
      const TMP_RET_VAL = await findManyLiteByQuery(datasource, context, params);
      return TMP_RET_VAL;
    },
    saveOne: async (
      context: IContextV1,
      params: IParamsV1SaveUser,
    ): Promise<IUserV1> => {
      const TMP_RET_VAL = await saveOne(datasource, context, params);
      return TMP_RET_VAL;
    },
    createOne: async (
      context: IContextV1,
      params: IParamsV1CreateUser,
    ): Promise<IUserV1> => {
      const TMP_RET_VAL = await createOne(datasource, context, params);
      return TMP_RET_VAL;
    },
    deleteOneById: async (
      context: IContextV1,
      params: IParamsV1DeleteUserById,
    ): Promise<IResponseV1DeleteUserById> => {
      const TMP_RET_VAL = await deleteOneById(datasource, context, params);
      return TMP_RET_VAL;
    },
    findOneById: async (
      context: IContextV1,
      params: IParamsV1FindUserById,
    ): Promise<IUserV1> => {
      const TMP_RET_VAL = await findOneById(datasource, context, params);
      return TMP_RET_VAL;
    },
    findOneByUsername: async (
      context: IContextV1,
      params: IParamsV1FindUserByUsername,
    ): Promise<IUserV1> => {
      const TMP_RET_VAL = await findOneByUserName(datasource, context, params);
      return TMP_RET_VAL;
    },
    updateOneLastLoginTimeById: async (
      context: IContextV1,
      params: IParamsV1UpdateUserLastLoginTimeById,
    ): Promise<IResponseV1UpdateUserLastLoginTimeById> => {
      const TMP_RET_VAL = await updateOneLastLoginTimeById(datasource, context, params);
      return TMP_RET_VAL;
    },
    updateOneLastSessionById: async (
      context: IContextV1,
      params: IParamsV1UpdateUserLastSession,
    ): Promise<IResponseV1UpdateUserLastSession> => {
      const TMP_RET_VAL = await updateOneLastSessionById(datasource, context, params);
      return TMP_RET_VAL;
    },
    updateOne: async (
      context: IContextV1,
      params: IParamsV1UpdateUser,
    ): Promise<IUserV1> => {
      const TMP_RET_VAL = await updateOne(datasource, context, params);
      return TMP_RET_VAL;
    },
    updateOneToken: async (
      context: IContextV1,
      params: IParamsV1UpdateUserToken,
    ): Promise<IResponseV1UpdateUserToken> => {
      const TMP_RET_VAL = await updateOneToken(datasource, context, params);
      return TMP_RET_VAL;
    },
  };
  return RET_VAL;
}
