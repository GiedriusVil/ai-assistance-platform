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
  addPagination,
  addMultipleSortConditions,
  matchAttributeId,
} from '@ibm-aiap/aiap-utils-mongo';

const testsMatcher = (
  query: {
    filter: {
      id: any
    },
  },
) => {
  const RET_VAL = {
    $match: {
      $and: [
        matchAttributeId(query?.filter)
      ]
    },
  };
  return RET_VAL;
}

const unwindByMatrixIntents = () => {
  const RET_VAL = {
    $unwind: {
      path: '$matrix.intents',
      preserveNullAndEmptyArrays: false
    }
  };
  return RET_VAL;
}

const projectMatrixIntents = () => {
  const RET_VAL = {
    $project: {
      _id: 0,
      actualIntent: '$matrix.intents.actualIntent',
      predictedIntent: '$matrix.intents.predictedIntent',
      value: '$matrix.intents.value',
    }
  };
  return RET_VAL;
}

const facetMatrixIntents = (
  query: {
    sort: IQuerySortV1,
    pagination: IQueryPaginationV1,
  }
) => {
  query.sort.fieldSecond = 'uniqueText';
  const RET_VAL = {
    $facet: {
      reports: [
        ...addMultipleSortConditions(query),
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
    unwindByMatrixIntents(),
    projectMatrixIntents(),
    facetMatrixIntents(query)

  ];
  return RET_VAL;
}
