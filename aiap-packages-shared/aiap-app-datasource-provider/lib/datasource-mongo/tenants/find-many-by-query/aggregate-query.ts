/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import lodash from '@ibm-aca/aca-wrapper-lodash';

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
            matchAttributeByRegex('description', query?.filter?.search),
          ]
        },
        matchAttributeByArrayOfPrimitives('_id', query?.filter?.ids),
      ]
    },
  };
  return RET_VAL;
}

const _projections = (
  query: {
    projections?: any,
  },
) => {
  const PROJECTIONS = query?.projections;
  if (
    !lodash.isEmpty(PROJECTIONS)
  ) {
    const RET_VAL = {
      $project: {
        _id: 0,
      },
    };
    const KEYS = Object.keys(PROJECTIONS);
    for (const KEY of KEYS) {
      RET_VAL.$project[KEY] = KEYS[KEY] ? 0 : 1;
    }
    return RET_VAL;
  }
}

export const aggregateQuery = (
  query: {
    filter?: {
      search?: any,
      ids?: Array<any>,
    },
    projections?: any,
    sort?: IQuerySortV1,
    pagination: IQueryPaginationV1,
  },
) => {
  const RET_VAL: Array<any> = [
    _matcher(query),
  ];

  const PROJECTIONS = query?.projections;
  if (
    PROJECTIONS
  ) {
    RET_VAL.push(_projections(query));
  }

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
      $set: {
        tempTotal: {
          $arrayElemAt: ['$total', 0]
        }
      }
    }
  );
  RET_VAL.push(
    {
      $project: {
        items: 1,
        total: {
          $ifNull: ['$tempTotal.count', 0]
        },
      }
    }
  );
  return RET_VAL;
}
