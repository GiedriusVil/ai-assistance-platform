/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import {
  IQuerySortV1,
  IQueryPaginationV1,
} from '@ibm-aiap/aiap--types-server';

import {
  IUserV1Changes,
} from '../types';

export interface IParamsV1FindUserV1ChangesByQuery {
  query: {
    filter: {
      dateRange: any,
      search: any,
    },
    sort: IQuerySortV1,
    pagination: IQueryPaginationV1,
  },
}

export interface IResponseV1FindUserV1ChangesByQuery {
  items: Array<any>,
  total: number,
}

export interface IParamsV1FindUserV1ChangesById {
  id?: any,
}

export interface IParamsV1SaveUserV1Changes {
  value: IUserV1Changes,
}
