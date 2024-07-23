/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import {
  IQuerySortV1,
  IQueryPaginationV1,
  IContextUserV1,
} from '@ibm-aiap/aiap--types-server';

import {
  IUserV1,
} from '../types';

export interface IParamsV1FindUsersByQuery {
  query: {
    filter?: {
      search?: any,
    },
    sort?: IQuerySortV1,
    pagination: IQueryPaginationV1,
  },
}

export interface IResponseV1FindUsersByQuery {
  items: Array<any>,
  total: number,
}

export interface IParamsV1FindUsersLiteByQuery {
  query: {
    filter?: {
      accessGroupsNames?: Array<any>,
      accessGroupsIds?: Array<any>,
    },
    sort?: IQuerySortV1,
    pagination: IQueryPaginationV1,
  },
}

export interface IResponseV1FindUsersLiteByQuery {
  items: Array<any>,
  total: number,
}

export interface IParamsV1CreateUser {
  value: IUserV1,
}

export interface IParamsV1DeleteUserById {
  id: any,
  reason?: any,
}

export interface IParamsV1DeleteUsersByIds {
  ids?: Array<any>,
  reason?: any,
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IResponseV1DeleteUserById {

}

export interface IParamsV1FindUserById {
  id: any,
}

export interface IParamsV1FindUserByUsername {
  username: any,
}

export interface IParamsV1SaveUser {
  value: IUserV1,
}

export interface IParamsV1UpdateUserLastLoginTime {
  value: IUserV1,
}

export interface IParamsV1UpdateUserLastLoginTimeById {
  id: any,
  lastLoginTime: any,
}

export interface IResponseV1UpdateUserLastLoginTimeById {
  modified: any,
}

export interface IResponseV1UpdateUserLastSession {
  modified: any,
}

export interface IParamsV1UpdateUser {
  value: IUserV1,
}

export interface IParamsV1UpdateUserLastSession {
  value: IUserV1 | IContextUserV1,
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IParamsV1UpdateUserToken {
  value: IUserV1,
  token?: any,
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IResponseV1UpdateUserToken {
  modified: any,
}
