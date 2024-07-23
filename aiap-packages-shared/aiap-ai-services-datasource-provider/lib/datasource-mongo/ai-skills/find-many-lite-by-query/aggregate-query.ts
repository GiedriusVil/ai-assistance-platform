/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import {
  IContextV1,
  IQueryPaginationV1,
  IQuerySortV1,
} from '@ibm-aiap/aiap--types-server';

import {
  matchFieldBetween2Dates,
  addSortCondition,
  addPagination,
  matchAttributeByRegex,
} from '@ibm-aiap/aiap-utils-mongo';

const _matcher = (
  context: IContextV1,
  query: {
    filter: {
      aiServiceId?: any,
      dateRange?: any,
    }
  },
) => {
  const RET_VAL = {
    $match: {
      $and: [
        matchFieldBetween2Dates('created', query?.filter),
        matchAttributeByRegex('aiServiceId', query?.filter?.aiServiceId),
      ]
    },
  };
  return RET_VAL;
}

export const aggregateQuery = (
  context: IContextV1,
  query: {
    filter: {
      aiServiceId?: any,
      dateRange?: any,
    },
    sort?: IQuerySortV1,
    pagination: IQueryPaginationV1,
  },
) => {
  const RET_VAL = [];
  RET_VAL.push(_matcher(context, query));
  RET_VAL.push({
    $facet: {
      items: [
        ...addSortCondition(query),
        ...addPagination(query)
      ],
      total: [
        {
          $count: 'count',
        }
      ]
    }
  });
  RET_VAL.push(
    {
      $set: { tempTotal: { $arrayElemAt: ['$total', 0] } }
    }
  );
  RET_VAL.push(
    {
      $project: {
        items: 1,
        total: { $ifNull: ['$tempTotal.count', 0] },
      }
    }
  );
  return RET_VAL;
}
