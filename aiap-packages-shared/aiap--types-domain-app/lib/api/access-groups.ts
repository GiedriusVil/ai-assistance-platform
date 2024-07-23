/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import {
  IQuerySortV1,
  IQueryPaginationV1,
} from '@ibm-aiap/aiap--types-server';

import {
  IAccessGroupV1,
} from '../types';

export interface IParamsV1FindAccessGroupsLiteByQuery {
  query: {
    filter?: {
      names?: Array<string>,
    },
    sort?: IQuerySortV1,
    pagination: IQueryPaginationV1,
  },
}

export interface IResponseV1FindAccessGroupsLiteByQuery {
  items: Array<any>,
  total: number,
}

export interface IParamsV1FindAccessGroupsByQuery {
  query: {
    filter?: {
      search?: any,
      names?: Array<any>,
      ids?: Array<any>,
    },
    sort?: IQuerySortV1,
    pagination: IQueryPaginationV1,
  },
}

export interface IParamsV1ExportAccessGroupsByQuery {
  query: {
    filter?: {
      search?: any,
      names?: Array<any>,
      ids?: Array<any>,
    },
    sort?: IQuerySortV1,
    pagination: IQueryPaginationV1,
  },
}

export interface IResponseV1FindAccessGroupsByQuery {
  items: Array<IAccessGroupV1>,
  total: number,
}

export interface IParamsV1DeleteAccessGroupByIdAndUpdateUsers {
  id: any,
  reason?: string,
}

export interface IParamsV1DeleteAccessGroupsByIdsAndUpdateUsers {
  ids: Array<any>,
  reason?: string,
}

export interface IResponseV1DeleteAccessGroupByIdAndUpdateUsers {
  deletedCount: number,
}

export interface IParamsV1DeleteAccessGroupById {
  id: any,
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IResponseV1DeleteAccessGroupById {

}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IParamsV1FindAccessGroupById {
  id: any,
}

export interface IParamsV1FindAccessGroupByName {
  name: any,
}

export interface IParamsV1SaveAccessGroup {
  value: IAccessGroupV1,
}

export interface IParamsV1SaveAccessGroups {
  values: Array<IAccessGroupV1>,
}

export interface IParamsV1ImportAccessGroups {
  file: any,
}

export interface IResponseV1ImportAccessGroups {
  status: string,
}
