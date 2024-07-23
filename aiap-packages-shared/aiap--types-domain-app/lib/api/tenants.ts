/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import {
  IQuerySortV1,
  IQueryPaginationV1,
} from '@ibm-aiap/aiap--types-server';

import {
  ITenantV1,
} from '../types';

export interface IParamsV1ExportTenantsByQuery {
  query: {
    filter?: {
      search?: any,
      ids?: Array<any>,
    },
    projections?: any,
    sort?: IQuerySortV1,
    pagination: IQueryPaginationV1,
  },
}

export interface IResponseV1ExportTenantsByQuery {
  items: Array<any>,
}

export interface IParamsV1FindTenantsByQuery {
  query: {
    filter?: {
      search?: any,
      ids?: Array<any>,
    },
    projections?: any,
    sort?: IQuerySortV1,
    pagination: IQueryPaginationV1,
  },
}

export interface IResponseV1FindTenantsByQuery {
  items: Array<any>,
  total: number,
}

export interface IParamsV1DeleteTenantById {
  id: any,
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IParamsV1GenerateTenantApiKey {

}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IParamsV1GenerateNewTenant {

}

export interface IParamsV1ImportTenantsByFile {
  file: any,
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IResponseV1DeleteTenantById {

}

export interface IParamsV1DeleteTenentsByIds {
  ids: Array<any>,
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IResponseV1DeleteTenantsByIds {

}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IParamsV1FindTenantByExternalId {
  externalId: any,
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IParamsV1FindTenantByIdAndHash {
  id: any,
  hash: any,
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IParamsV1FindTenantById {
  id: any,
}

export interface IParamsV1SaveTenant {
  value: ITenantV1,
}

export interface IParamsV1SaveTenants {
  values: Array<ITenantV1>,
}
