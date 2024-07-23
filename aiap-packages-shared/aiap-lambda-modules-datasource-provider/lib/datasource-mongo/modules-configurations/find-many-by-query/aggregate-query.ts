/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import {
  matchAttributeByRegex,
  addSortCondition,
  addPagination,
} from '@ibm-aiap/aiap-utils-mongo';

import {
  IContextV1,
} from '@ibm-aiap/aiap--types-server';

import {
  IFindLambdaModulesConfigurationsByQueryParamsV1
} from '../../../types';

const _matcher = (params: IFindLambdaModulesConfigurationsByQueryParamsV1) => {
  const FILTER = params?.filter;
  const FILTER_SEARCH = FILTER?.search;
  const RET_VAL = {
    $match: {
      $and: [
        //matchFieldBetween2Dates('timestamp', FILTER),
        {
          $or: [
            matchAttributeByRegex('key', FILTER_SEARCH),
          ]
        }
      ]
    },
  };
  return RET_VAL;
}

const setTotal = () => {
  const RET_VAL = {
    $set: { tempTotal: { $arrayElemAt: ['$total', 0] } },
  };
  return RET_VAL;
}

const projectTotal = () => {
  const RET_VAL = {
    $project: {
      items: 1,
      total: { $ifNull: ['$tempTotal.count', 0] },
    }
  };
  return RET_VAL;
}

const facetFindManyByQuery = (params) => {
  const RET_VAL = {
    $facet: {
      items: [
        ...addSortCondition(params),
        ...addPagination(params),
      ],
      total: [
        {
          $count: 'count',
        },
      ]
    },
  };
  return RET_VAL;
}

const aggregateQuery = (
  context: IContextV1,
  params: IFindLambdaModulesConfigurationsByQueryParamsV1) => {
  const RET_VAL = [
    _matcher(params),
    facetFindManyByQuery(params),
    setTotal(),
    projectTotal(),
  ];
  return RET_VAL;
}

export {
  aggregateQuery,
}
