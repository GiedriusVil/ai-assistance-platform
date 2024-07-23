/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import {
  IQuerySortV1,
  IQueryPaginationV1,
} from '@ibm-aiap/aiap--types-server';

import {
  IApplicationV1,
} from '../types';

export interface IParamsV1ExportApplicationsByQuery {
  query: {
    filter?: {
      search?: any,
      ids?: Array<any>,
    },
    sort?: IQuerySortV1,
    pagination: IQueryPaginationV1,
  },
}

export interface IParamsV1FindApplicationsByQuery {
  query: {
    filter?: {
      search?: any,
      ids?: Array<any>,
    },
    sort?: IQuerySortV1,
    pagination: IQueryPaginationV1,
  },
}

export interface IResponseV1FindApplicationsByQuery {
  items: Array<any>,
  total: number,
}

export interface IParamsV1DeleteApplicationsByIds {
  ids: Array<any>,
}

export interface IResponseV1DeleteApplicationsByIds {
  ids: Array<any>,
  status: string,
}

export interface IParamsV1FindApplicationsByTenantId {
  tenantId: any,
}

export interface IParamsV1FindApplicationById {
  id: any,
}

export interface IParamsV1SaveApplication {
  value: IApplicationV1,
}

export interface IParamsV1ImportApplications {
  file: any,
}
