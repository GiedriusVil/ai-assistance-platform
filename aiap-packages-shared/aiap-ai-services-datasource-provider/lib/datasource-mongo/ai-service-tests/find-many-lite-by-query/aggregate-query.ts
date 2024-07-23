/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { IContextV1, IQueryPaginationV1, IQuerySortV1 } from '@ibm-aiap/aiap--types-server';
import {
  matchFieldBetween2Dates,
  matchAttributeByRegex,
  addSortCondition,
  addPagination,
} from '@ibm-aiap/aiap-utils-mongo';

const addMatcherToPipeline = (
  query: {
    filter: {
      testId: any,
      testName: any,
      dateRange: any,
    }
  },
  pipeline: Array<any>,
) => {
  const MATCHER = {
    $match: {
      $and: [
        {
          $or: [
            matchFieldBetween2Dates('started', query?.filter),
            matchFieldBetween2Dates('ended', query?.filter),
          ]
        },
        matchAttributeByRegex('_id', query?.filter?.testId),
        matchAttributeByRegex('testName', query?.filter?.testName),
      ]
    },
  };
  pipeline.push(MATCHER);
}

const addProjectGroupFieldsToPipeline = (
  pipeline: Array<any>,
) => {
  const PROJECT = {
    $project: {
      kfoldData: 0,
      incorrectMatches: 0,
      matrix: 0,
      metrics: 0,
      testResult: 0
    }
  };
  pipeline.push(PROJECT);
}

const addFacetTotalItemsToPipeline = (
  query: {
    sort: IQuerySortV1,
    pagination: IQueryPaginationV1,
  },
  pipeline: Array<any>,
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
      ]
    }
  };
  pipeline.push(FACET);
}

export const aggregateQuery = (
  context: IContextV1,
  query: {
    filter: {
      testId: any,
      testName: any,
      dateRange: any,
    },
    sort: IQuerySortV1,
    pagination: IQueryPaginationV1,
  }
) => {
  const PIPELINE = [];
  addMatcherToPipeline(query, PIPELINE);
  addProjectGroupFieldsToPipeline(PIPELINE);
  addFacetTotalItemsToPipeline(query, PIPELINE);
  return PIPELINE;
}
