/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import lodash from '@ibm-aca/aca-wrapper-lodash';

import {
  IQueryPaginationV1,
  IQuerySortV1,
} from '@ibm-aiap/aiap--types-server';

/**
* @deprecated -> LEGO -> Use search from filter?.search!!!
*/
export const constructDefaultFindManyQueryFromRequest = (
  request: any,
): {
  /**
 * @deprecated -> LEGO -> Use search from filter?.search!!!
 */
  search?: any,
  filter?: {
    search?: any,
  },
  sort?: IQuerySortV1,
  pagination?: IQueryPaginationV1,
} => {
  const RET_VAL: {
    /**
     * @deprecated -> LEGO -> Use search from filter?.search!!!
     */
    search?: any,
    filter?: {
      search?: any,
    },
    sort?: IQuerySortV1,
    pagination?: IQueryPaginationV1,
  } = {};
  if (
    !lodash.isEmpty(request?.query?.search)
  ) {
    RET_VAL.search = request?.query?.search;
    RET_VAL.filter = {
      search: request?.query?.search,
    }
  }
  if (
    !lodash.isEmpty(request?.query?.field) &&
    !lodash.isEmpty(request?.query?.sort)
  ) {
    RET_VAL.sort = {
      field: request?.query?.field,
      direction: request?.query?.sort,
    }
  }
  if (
    !lodash.isEmpty(request?.query?.page) &&
    !lodash.isEmpty(request?.query?.size)
  ) {
    RET_VAL.pagination = {
      page: request?.query?.page,
      size: request?.query?.size,
    }
  }
  return RET_VAL;
}
