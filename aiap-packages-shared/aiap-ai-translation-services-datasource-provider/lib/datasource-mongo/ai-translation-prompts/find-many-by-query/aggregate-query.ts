/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import {
  addSortCondition,
  addPagination,
  matchAttributeByRegex,
} from '@ibm-aiap/aiap-utils-mongo';

const _matcher = (
  params: {
    filter?: {
      search?: string,
      aiTranslationServiceId?: string
    }
  },
) => {
  const FILTER = params?.filter;

  const FILTER_SEARCH = FILTER?.search;
  const FILTER_AI_TRANSLATION_SERVICE_ID = FILTER?.aiTranslationServiceId;

  const RET_VAL = {
    $match: {
      $and: [
        matchAttributeByRegex('name', FILTER_SEARCH),
        matchAttributeByRegex('serviceId', FILTER_AI_TRANSLATION_SERVICE_ID),
      ]
    },
  };
  return RET_VAL;
}

const aggregateQuery = (
  params: {
    filter?: {
      search?: string,
      aiTranslationServiceId?: string
    },
    sort?: {
      field: string,
      direction: string,
    },
    pagination: {
      page: any,
      size: any,
    }
  },
) => {
  const RET_VAL = [];
  RET_VAL.push(_matcher(params));
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
      $set: {
        tempTotal: {
          $arrayElemAt: [
            '$total',
            0
          ]
        }
      }
    }
  );
  RET_VAL.push(
    {
      $project: {
        items: 1,
        total: {
          $ifNull: [
            '$tempTotal.count',
            0
          ]
        },
      }
    }
  );
  return RET_VAL;
}

export {
  aggregateQuery,
}
