/*
  © Copyright IBM Corporation 2023. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import {
  IContextV1,
} from '@ibm-aiap/aiap--types-server';

import {
  // types
  IAccessGroupV1,
  IAccessGroupV1Changes,
  IApplicationV1,
  IApplicationV1Changes,
  ITenantV1,
  ITenantV1Changes,
  IUserV1,
  IUserV1Changes,
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
  // api-access-groups-changes
  IParamsV1FindAccessGroupV1ChangesByQuery,
  IResponseV1FindAccessGroupV1ChangesByQuery,
  IParamsV1FindAccessGroupV1ChangesById,
  IParamsV1SaveAccessGroupV1Changes,
  // api-applications
  IParamsV1FindApplicationsByQuery,
  IResponseV1FindApplicationsByQuery,
  IParamsV1DeleteApplicationsByIds,
  IResponseV1DeleteApplicationsByIds,
  IParamsV1FindApplicationsByTenantId,
  IParamsV1FindApplicationById,
  IParamsV1SaveApplication,
  // api-applications-changes
  IParamsV1FindApplicationV1ChangesByQuery,
  IResponseV1FindApplicationV1ChangesByQuery,
  IParamsV1FindApplicationV1ChangesById,
  IParamsV1SaveApplicationV1Changes,
  // api-tenants
  IParamsV1FindTenantsByQuery,
  IResponseV1FindTenantsByQuery,
  IParamsV1DeleteTenantById,
  IResponseV1DeleteTenantById,
  IParamsV1FindTenantByExternalId,
  IParamsV1FindTenantByIdAndHash,
  IParamsV1FindTenantById,
  IParamsV1SaveTenant,
  // api-tenants-changes
  IParamsV1FindTenantV1ChangesByQuery,
  IResponseV1FindTenantV1ChangesByQuery,
  IParamsV1FindTenantV1ChangesById,
  IParamsV1SaveTenantV1Changes,
  // api-users
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
  // api-users-changes
  IParamsV1FindUserV1ChangesByQuery,
  IResponseV1FindUserV1ChangesByQuery,
  IParamsV1FindUserV1ChangesById,
  IParamsV1SaveUserV1Changes,
} from '@ibm-aiap/aiap--types-domain-app';

export interface IDatasourceAppV1 {

  get accessGroups(): {
    findManyByQuery(
      context: IContextV1,
      params: IParamsV1FindAccessGroupsByQuery,
    ): Promise<IResponseV1FindAccessGroupsByQuery>,
    findManyLiteByQuery(
      context: IContextV1,
      params: IParamsV1FindAccessGroupsLiteByQuery,
    ): Promise<IResponseV1FindAccessGroupsLiteByQuery>,
    deleteOneByIdAndUpdateUsers(
      context: IContextV1,
      params: IParamsV1DeleteAccessGroupByIdAndUpdateUsers,
    ): Promise<IResponseV1DeleteAccessGroupByIdAndUpdateUsers>,
    deleteOneById(
      context: IContextV1,
      params: IParamsV1DeleteAccessGroupById,
    ): Promise<IResponseV1DeleteAccessGroupById>,
    findOneById(
      context: IContextV1,
      params: IParamsV1FindAccessGroupById,
    ): Promise<IAccessGroupV1>,
    findOneByName(
      context: IContextV1,
      params: IParamsV1FindAccessGroupByName,
    ): Promise<IAccessGroupV1>,
    saveOne(
      context: IContextV1,
      params: IParamsV1SaveAccessGroup,
    ): Promise<IAccessGroupV1>,
  }

  get accessGroupsChanges(): {
    findManyByQuery(
      context: IContextV1,
      params: IParamsV1FindAccessGroupV1ChangesByQuery,
    ): Promise<IResponseV1FindAccessGroupV1ChangesByQuery>,
    findOneById(
      context: IContextV1,
      params: IParamsV1FindAccessGroupV1ChangesById,
    ): Promise<IAccessGroupV1Changes>,
    saveOne(
      context: IContextV1,
      params: IParamsV1SaveAccessGroupV1Changes,
    ): Promise<IAccessGroupV1Changes>,
  }

  get applications(): {
    findManyByQuery(
      context: IContextV1,
      params: IParamsV1FindApplicationsByQuery,
    ): Promise<IResponseV1FindApplicationsByQuery>,
    deleteManyByIds(
      context: IContextV1,
      params: IParamsV1DeleteApplicationsByIds,
    ): Promise<IResponseV1DeleteApplicationsByIds>,
    findManyByTenantId(
      context: IContextV1,
      params: IParamsV1FindApplicationsByTenantId,
    ): Promise<Array<IApplicationV1>>,
    findOneById(
      context: IContextV1,
      params: IParamsV1FindApplicationById,
    ): Promise<IApplicationV1>,
    saveOne(
      context: IContextV1,
      params: IParamsV1SaveApplication,
    ): Promise<IApplicationV1>,
  }

  get applicationsChanges(): {
    findManyByQuery(
      context: IContextV1,
      params: IParamsV1FindApplicationV1ChangesByQuery,
    ): Promise<IResponseV1FindApplicationV1ChangesByQuery>,
    findOneById(
      context: IContextV1,
      params: IParamsV1FindApplicationV1ChangesById,
    ): Promise<IApplicationV1Changes>,
    saveOne(
      context: IContextV1,
      params: IParamsV1SaveApplicationV1Changes,
    ): Promise<IApplicationV1Changes>,
  }

  get tenants(): {
    findManyByQuery(
      context: IContextV1,
      params: IParamsV1FindTenantsByQuery,
    ): Promise<IResponseV1FindTenantsByQuery>,
    deleteOneById(
      context: IContextV1,
      params: IParamsV1DeleteTenantById,
    ): Promise<IResponseV1DeleteTenantById>,
    findOneByExternalId(
      context: IContextV1,
      params: IParamsV1FindTenantByExternalId,
    ): Promise<ITenantV1>,
    findOneByIdAndHash(
      context: IContextV1,
      params: IParamsV1FindTenantByIdAndHash,
    ): Promise<ITenantV1>,
    findOneById(
      context: IContextV1,
      params: IParamsV1FindTenantById,
    ): Promise<ITenantV1>,
    saveOne(
      context: IContextV1,
      params: IParamsV1SaveTenant,
    ): Promise<ITenantV1>,
  }

  get tenantsChanges(): {
    findManyByQuery(
      context: IContextV1,
      params: IParamsV1FindTenantV1ChangesByQuery,
    ): Promise<IResponseV1FindTenantV1ChangesByQuery>,
    findOneById(
      context: IContextV1,
      params: IParamsV1FindTenantV1ChangesById,
    ): Promise<ITenantV1Changes>,
    saveOne(
      context: IContextV1,
      params: IParamsV1SaveTenantV1Changes,
    ): Promise<ITenantV1Changes>,
  }

  get users(): {
    ensureDefaults(
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
    ): Promise<void>,
    findManyByQuery(
      context: IContextV1,
      params: IParamsV1FindUsersByQuery,
    ): Promise<IResponseV1FindUsersByQuery>,
    findManyLiteByQuery(
      context: IContextV1,
      params: IParamsV1FindUsersLiteByQuery,
    ): Promise<IResponseV1FindUsersLiteByQuery>,
    saveOne(
      context: IContextV1,
      params: IParamsV1SaveUser,
    ): Promise<IUserV1>,
    createOne(
      context: IContextV1,
      params: IParamsV1CreateUser,
    ): Promise<IUserV1>,
    deleteOneById(
      context: IContextV1,
      params: IParamsV1DeleteUserById,
    ): Promise<IResponseV1DeleteUserById>,
    findOneById(
      context: IContextV1,
      params: IParamsV1FindUserById,
    ): Promise<IUserV1>,
    findOneByUsername(
      context: IContextV1,
      params: IParamsV1FindUserByUsername,
    ): Promise<IUserV1>,
    updateOneLastLoginTimeById(
      context: IContextV1,
      params: IParamsV1UpdateUserLastLoginTimeById,
    ): Promise<IResponseV1UpdateUserLastLoginTimeById>,
    updateOneLastSessionById(
      context: IContextV1,
      params: IParamsV1UpdateUserLastSession,
    ): Promise<IResponseV1UpdateUserLastSession>,
    updateOne(
      context: IContextV1,
      params: IParamsV1UpdateUser,
    ): Promise<IUserV1>,
    updateOneToken(
      context: IContextV1,
      params: IParamsV1UpdateUserToken,
    ): Promise<IResponseV1UpdateUserToken>,
  }

  get usersChanges(): {
    findManyByQuery(
      context: IContextV1,
      params: IParamsV1FindUserV1ChangesByQuery,
    ): Promise<IResponseV1FindUserV1ChangesByQuery>,
    findOneById(
      context: IContextV1,
      params: IParamsV1FindUserV1ChangesById,
    ): Promise<IUserV1Changes>,
    saveOne(
      context: IContextV1,
      params: IParamsV1SaveUserV1Changes,
    ): Promise<IUserV1Changes>,
  }

}
