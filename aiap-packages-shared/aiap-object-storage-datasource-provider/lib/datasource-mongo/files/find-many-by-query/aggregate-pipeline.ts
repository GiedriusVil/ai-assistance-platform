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
      bucketId?: string,
    }
  },
) => {
  const FILTER = params?.filter;
  const FILTER_SEARCH = FILTER?.search;
  const FILTER_BUCKET_ID = FILTER?.bucketId;

  const RET_VAL = {
    $match: {
      $and: [
        {
          $or: [
            matchAttributeByRegex('reference', FILTER_SEARCH),
          ]
        },
        matchAttributeByRegex('bucketId', FILTER_BUCKET_ID)
      ]
    },
  };
  return RET_VAL;
}

const aggregatePipeline = (
  params: {
    filter?: {
      search?: string,
      bucketId: string,
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
  aggregatePipeline,
}
