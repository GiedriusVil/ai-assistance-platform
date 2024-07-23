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
  addSortCondition,
  addPagination,
  matchAttributeByRegex,
  matchFieldBetween2Dates,
} from '@ibm-aiap/aiap-utils-mongo';

const addMatcherToPipeline = (
  pipeline: Array<any>,
  query: {
    filter: {
      dateRange: any,
      search: any,
    },
  },
) => {
  const MATCHER = {
    $match: {
      $and: [
        matchFieldBetween2Dates('created.date', query?.filter),
        {
          $or: [
            matchAttributeByRegex('docId', query?.filter?.search),
            matchAttributeByRegex('created.user.id', query?.filter?.search),
            matchAttributeByRegex('created.user.name', query?.filter?.search),
          ],
        },
      ],
    },
  };
  pipeline.push(MATCHER);
}

const addFacetTotalItems = (
  pipeline: Array<any>,
  query: {
    sort: IQuerySortV1,
    pagination: IQueryPaginationV1,
  },
) => {
  const FACET = {
    $facet: {
      items: [
        ...addSortCondition(query),
        ...addPagination(query),
      ],
      total: [
        {
          $count: 'count',
        },
      ],
    },
  };
  pipeline.push(FACET);
}

const addSetTotal = (pipeline) => {
  const SET = {
    $set: {
      tempTotal: {
        $arrayElemAt: ['$total', 0],
      },
    },
  };
  pipeline.push(SET);
}

const addProjectTotalItems = (pipeline) => {
  const PROJECT = {
    $project: {
      items: 1,
      total: { $ifNull: ['$tempTotal.count', 0] },
    },
  };
  pipeline.push(PROJECT);
}

export const aggregateQuery = (
  context: IContextV1,
  query: {
    filter: {
      dateRange: any,
      search: any,
    },
    sort: IQuerySortV1,
    pagination: IQueryPaginationV1,
  },
) => {
  const PIPELINE = [];
  addMatcherToPipeline(PIPELINE, query);
  addFacetTotalItems(PIPELINE, query);
  addSetTotal(PIPELINE);
  addProjectTotalItems(PIPELINE);
  return PIPELINE;
}
