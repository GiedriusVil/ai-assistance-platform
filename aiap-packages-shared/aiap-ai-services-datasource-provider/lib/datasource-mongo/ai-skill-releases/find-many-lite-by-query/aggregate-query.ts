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
} from '@ibm-aiap/aiap-utils-mongo';

const addMatcherToPipeline = (
  query: {
    filter: {
      aiServiceId: any,
      aiSkillId: any,
    },
  },
  pipeline: Array<any>,
) => {
  const MATCHER = {
    $match: {
      $and: [
        matchAttributeByRegex('aiServiceId', query?.filter?.aiServiceId),
        matchAttributeByRegex('aiSkillId', query?.filter?.aiSkillId),
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
      versions: 0
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
        ...addPagination(query)
      ],
      total: [
        {
          $count: 'count',
        }
      ]
    }
  };
  pipeline.push(FACET);
}

const addSetTotalToPipeline = (
  pipeline: Array<any>,
) => {
  const SET = {
    $set: {
      tempTotal: {
        $arrayElemAt: ['$total', 0],
      }
    }
  };
  pipeline.push(SET);
}

const addProjectItemsToPipeline = (
  pipeline: Array<any>,
) => {
  const PROJECT = {
    $project: {
      items: 1,
      total: { $ifNull: ['$tempTotal.count', 0] },
    }
  };
  pipeline.push(PROJECT);
}

export const aggregateQuery = (
  context: IContextV1,
  query: {
    filter: {
      aiServiceId: any,
      aiSkillId: any,
    },
    sort: IQuerySortV1,
    pagination: IQueryPaginationV1,
  },
) => {
  const PIPELINE = [];
  addMatcherToPipeline(query, PIPELINE);
  addProjectGroupFieldsToPipeline(PIPELINE);
  addFacetTotalItemsToPipeline(query, PIPELINE);
  addSetTotalToPipeline(PIPELINE);
  addProjectItemsToPipeline(PIPELINE);
  return PIPELINE;
}
