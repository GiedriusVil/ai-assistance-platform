/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import {
  IQueryPaginationV1,
  IQuerySortV1,
} from '@ibm-aiap/aiap--types-server';

import {
  addSortCondition,
  addPagination,
  matchAttributeByRegex,
  matchAttributeByArrayOfPrimitives,
} from '@ibm-aiap/aiap-utils-mongo';

const _matcher = (
  query: {
    filter?: {
      search?: any,
      ids?: Array<any>,
    },
  },
) => {
  const RET_VAL = {
    $match: {
      $and: [
        {
          $or: [
            matchAttributeByRegex('name', query?.filter?.search),
          ]
        },
        matchAttributeByArrayOfPrimitives('_id', query?.filter?.ids),
      ]
    },
  };
  return RET_VAL;
}

export const aggregateQuery = (
  query: {
    filter?: {
      search?: any,
      ids?: Array<any>,
    },
    sort?: IQuerySortV1,
    pagination: IQueryPaginationV1,
  },
) => {
  const RET_VAL: Array<any> = [
    _matcher(query),
  ];
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
