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
  matchAttributeByRegex,
  addSortCondition,
  addPagination,
} from '@ibm-aiap/aiap-utils-mongo';

const testsMatcher = (
  query: {
    filter: {
      id: any,
      testName: any,
      dateRange: any
    }
  },
) => {
  const RET_VAL = {
    $match: {
      $and: [
        {
          $or: [
            matchFieldBetween2Dates('started', { query }),
            matchFieldBetween2Dates('ended', { query }),
          ]
        },
        matchAttributeByRegex('_id', query?.filter?.id),
        // TODO -> LEGO -> Sviestas sviestuotas!!!
        matchAttributeByRegex('testName', query?.filter.testName),
      ]
    },
  };
  return RET_VAL;
}


const facetFindManyByQuery = (
  query: {
    sort: IQuerySortV1,
    pagination: IQueryPaginationV1,
  },
) => {
  const RET_VAL = {
    $facet: {
      items: [
        ...addSortCondition(query),
        ...addPagination(query),
      ],
      total: [
        {
          $count: 'count',
        },
      ]
    }
  };
  return RET_VAL;
}

export const aggregateQuery = (
  context: IContextV1,
  query: {
    filter: {
      id: any,
      testName: any,
      dateRange: any
    },
    sort: IQuerySortV1,
    pagination: IQueryPaginationV1,
  },
) => {
  const RET_VAL = [
    testsMatcher(query),
    facetFindManyByQuery(query)
  ];
  return RET_VAL;
}

