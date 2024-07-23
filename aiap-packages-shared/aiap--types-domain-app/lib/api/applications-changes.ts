/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import {
  IQuerySortV1,
  IQueryPaginationV1,
} from '@ibm-aiap/aiap--types-server';

import {
  IApplicationV1Changes,
} from '../types';

export interface IParamsV1FindApplicationV1ChangesByQuery {
  query: {
    filter: {
      dateRange: any,
      search: any,
    },
    sort: IQuerySortV1,
    pagination: IQueryPaginationV1,
  },
}

export interface IResponseV1FindApplicationV1ChangesByQuery {
  items: Array<any>,
  total: number,
}

export interface IParamsV1FindApplicationV1ChangesById {
  id?: any,
}

export interface IParamsV1SaveApplicationV1Changes {
  value: IApplicationV1Changes,
}
