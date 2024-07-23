/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import Express from 'express';

import lodash from '@ibm-aca/aca-wrapper-lodash';

import {
  IQueryPaginationV1,
  IQuerySortV1,
} from '@ibm-aiap/aiap--types-server';

export const constructParamsV1DefaultFindManyQueryFromRequest = (
  request: Express.Request,
): {
  query: {
    filter?: {
      search?: any,
    },
    sort?: IQuerySortV1,
    pagination: IQueryPaginationV1,
  }
} => {
  const RET_VAL: {
    query: {
      filter?: {
        search?: any,
      },
      sort?: IQuerySortV1,
      pagination: IQueryPaginationV1,
    }
  } = {
    query: {
      pagination: {
        page: 1,
        size: 9999,
      }
    },
  };
  if (
    !lodash.isEmpty(request?.query?.search)
  ) {
    RET_VAL.query.filter = {
      search: request?.query?.search,
    }
  }
  if (
    !lodash.isEmpty(request?.query?.field) &&
    !lodash.isEmpty(request?.query?.sort)
  ) {
    RET_VAL.query.sort = {
      field: request?.query?.field,
      direction: request?.query?.sort,
    }
  }
  if (
    !lodash.isEmpty(request?.query?.page) &&
    !lodash.isEmpty(request?.query?.size)
  ) {
    RET_VAL.query.pagination = {
      page: request?.query?.page,
      size: request?.query?.size,
    }
  }
  return RET_VAL;
}
