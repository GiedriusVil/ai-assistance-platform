/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import {
  addSortCondition,
  addPagination,
  matchAttributeByRegex,
} from '@ibm-aiap/aiap-utils-mongo';

import {
  IFindEngagementsByQueryParamsV1
} from '../../../types';

const _matcher = (
  params: IFindEngagementsByQueryParamsV1
) => {
  const FILTER = params?.filter;
  const FILTER_SEARCH = FILTER?.search;
  const IS_NOT_FULLSCREEN = params?.isNotFullscreen;
  const RET_VAL = {
    $match: {
      $and: [
        IS_NOT_FULLSCREEN ? { 'chatApp.isFullscreen': { '$ne': true } } : {},
        {
          $or: [
            matchAttributeByRegex('name', FILTER_SEARCH),
            matchAttributeByRegex('id', FILTER_SEARCH),
          ]
        }
      ]
    },
  };
  return RET_VAL;
}

export const aggregateQuery = (
  params: IFindEngagementsByQueryParamsV1
) => {
  const RET_VAL: Array<any> = [
    _matcher(params),
  ];
  RET_VAL.push({
    $facet: {
      items: [
        ...addSortCondition(params),
        ...addPagination(params)
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
