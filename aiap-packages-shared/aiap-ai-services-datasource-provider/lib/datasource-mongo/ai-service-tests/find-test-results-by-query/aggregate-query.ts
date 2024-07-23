/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { IContextV1, IQueryPaginationV1, IQuerySortV1 } from '@ibm-aiap/aiap--types-server';
import {
  addPagination,
  addMultipleSortConditions,
  matchAttributeByRegex,
} from '@ibm-aiap/aiap-utils-mongo';

const testsMatcher = (
  query: {
    filter: {
      id: any,
    }
  }
) => {
  const RET_VAL = {
    $match: {
      $and: [
        matchAttributeByRegex('_id', query?.filter?.id),
      ]
    },
  };
  return RET_VAL;
}

const unwindByTestResult = () => {
  const RET_VAL = {
    $unwind: {
      path: '$testResult',
      preserveNullAndEmptyArrays: false
    }
  };
  return RET_VAL
}

const projectTestResult = () => {
  const RET_VAL = {
    $project: {
      _id: 0,
      utterance: '$testResult.originalText',
      predictedIntent: '$testResult.predictedIntent',
      actualIntent: '$testResult.actualIntent1',
      confidence: '$testResult.actualConfidence1',
      entities: '$testResult.entities',
      intentsMatch: '$testResult.intentsMatch',
      fold: '$testResult.foldNumber'
    }
  };
  return RET_VAL
}

const facetTestResult = (
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
    unwindByTestResult(),
    projectTestResult(),
    facetTestResult(query)

  ];
  return RET_VAL;
}
