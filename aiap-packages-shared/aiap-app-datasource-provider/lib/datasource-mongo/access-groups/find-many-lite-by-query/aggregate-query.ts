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
} from '@ibm-aiap/aiap-utils-mongo';

const matcher = (
  query: {
    filter?: {
      names?: Array<string>,
    },
  },
) => {
  const NAMES = query?.filter?.names;
  const RET_VAL = {
    $match: {
      $and: [
        {
          name: {
            $in: NAMES
          }
        }
      ]
    },
  };
  return RET_VAL;
}

const addProject = () => {
  const RET_VAL = {
    $project: {
      _id: 1,
      name: 1,
    }
  };
  return RET_VAL;
}

const facet = (
  query: {
    sort?: IQuerySortV1,
    pagination: IQueryPaginationV1,
  }
) => {
  const RET_VAL = {
    $facet: {
      items: [
        addProject(),
        ...addSortCondition(query),
        ...addPagination(query)
      ],
      total: [
        {
          $count: 'count',
        }
      ]
    }
  }
  return RET_VAL;
}

const set = () => {
  const RET_VAL = {
    $set: { tempTotal: { $arrayElemAt: ['$total', 0] } }
  }
  return RET_VAL;
}

const lastProject = () => {
  const RET_VAL = {
    $project: {
      items: 1,
      total: { $ifNull: ['$tempTotal.count', 0] },
    }
  }
  return RET_VAL;
}

export const aggregateQuery = (
  query: {
    filter?: {
      names?: Array<string>,
    },
    sort?: IQuerySortV1,
    pagination: IQueryPaginationV1,
  }
) => {
  const RET_VAL = [];
  RET_VAL.push(matcher(query));
  RET_VAL.push(facet(query));
  RET_VAL.push(set());
  RET_VAL.push(lastProject());
  return RET_VAL;
}
