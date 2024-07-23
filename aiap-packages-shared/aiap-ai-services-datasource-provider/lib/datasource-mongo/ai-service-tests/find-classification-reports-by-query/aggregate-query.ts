/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import {
  IContextV1,
  IQuerySortV1,
  IQueryPaginationV1,
} from '@ibm-aiap/aiap--types-server';

import {
  addSortCondition,
  addPagination,
  matchAttributeId,
} from '@ibm-aiap/aiap-utils-mongo';

const testsMatcher = (
  query: {
    filter: {
      id: any,
    },
  },
) => {
  const RET_VAL = {
    $match: {
      $and: [
        matchAttributeId(query?.filter),
      ]
    },
  };
  return RET_VAL;
}

const unwindByClassReport = () => {
  const RET_VAL = {
    $unwind: {
      path: '$metrics.overall.classificationReport',
      preserveNullAndEmptyArrays: false
    }
  };
  return RET_VAL
}

const projectClassReport = () => {
  const RET_VAL = {
    $project: {
      _id: 0,
      name: '$metrics.overall.classificationReport.name',
      recall: '$metrics.overall.classificationReport.recall',
      precision: '$metrics.overall.classificationReport.precision',
      fscore: '$metrics.overall.classificationReport.f1-score'
    },
  };
  return RET_VAL
}

const facetClassReport = (
  query: {
    sort: IQuerySortV1,
    pagination: IQueryPaginationV1,
  },
) => {
  const RET_VAL = {
    $facet: {
      reports: [
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
    },
    sort: IQuerySortV1,
    pagination: IQueryPaginationV1,
  },
) => {
  const RET_VAL = [
    testsMatcher(query),
    unwindByClassReport(),
    projectClassReport(),
    facetClassReport(query)

  ];
  return RET_VAL;
}

