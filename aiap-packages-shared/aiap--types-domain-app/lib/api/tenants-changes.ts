/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import {
  IQuerySortV1,
  IQueryPaginationV1,
} from '@ibm-aiap/aiap--types-server';

import {
  ITenantV1Changes,
} from '../types';

export interface IParamsV1FindTenantV1ChangesByQuery {
  query: {
    filter: {
      dateRange: any,
      search: any,
    },
    sort: IQuerySortV1,
    pagination: IQueryPaginationV1,
  },
}

export interface IResponseV1FindTenantV1ChangesByQuery {
  items: Array<any>,
  total: number,
}

export interface IParamsV1FindTenantV1ChangesById {
  id?: any,
}

export interface IParamsV1SaveTenantV1Changes {
  value: ITenantV1Changes,
}
