/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import {
  addSortCondition,
  addPagination,
  matchAttributeByRegex,
  matchAttributeByBase64Regex,
  matchAttributeByArrayOfPrimitives
} from '@ibm-aiap/aiap-utils-mongo';

import {
  IContextV1,
} from '@ibm-aiap/aiap--types-server';

import {
  IFindLambdaModulesByQueryParamsV1
} from '../../../types';

const _matcher = (
  context: IContextV1, 
  params: IFindLambdaModulesByQueryParamsV1) => {
  const FILTER = params?.filter;
  const FILTER_SEARCH = FILTER?.search;
  const IDS = params?.ids;
  const RET_VAL = {
    $match: {
      $and: [
        //matchFieldBetween2Dates('timestamp', FILTER),
        {
          $or: [
            matchAttributeByRegex('_id', FILTER_SEARCH),
            matchAttributeByRegex('type', FILTER_SEARCH),
            matchAttributeByBase64Regex('code', FILTER_SEARCH),
          ]
        },
        matchAttributeByArrayOfPrimitives('_id', IDS),
      ]
    },
  };
  return RET_VAL;
}

const aggregateQuery = (
  context: IContextV1, 
  params: IFindLambdaModulesByQueryParamsV1) => {
  const RET_VAL = [];
  RET_VAL.push(_matcher(context, params));
  RET_VAL.push({
    $facet: {
      items: [
        ...addSortCondition(params),
        ...addPagination(params),
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
      $set: { tempTotal: { $arrayElemAt: ['$total', 0] } }
    }
  );
  RET_VAL.push(
    {
      $project: {
        items: 1,
        total: { $ifNull: ['$tempTotal.count', 0] },
      }
    }
  );
  return RET_VAL;
}

export {
  aggregateQuery,
}
