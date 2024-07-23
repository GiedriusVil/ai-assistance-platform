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
      aiTranslationPromptId?: string,
      aiTranslationServiceId?: string,
      source?: string,
      target?: string,
    }
  },
) => {
  const FILTER = params?.filter;

  const FILTER_SEARCH = FILTER?.search;
  const FILTER_AI_TRANSLATION_PROMPT_ID = FILTER?.aiTranslationPromptId;
  const FILTER_AI_TRANSLATION_SERVICE_ID = FILTER?.aiTranslationServiceId;
  const FILTER_SOURCE_LANG = FILTER?.source;
  const FILTER_TARGET_LANG = FILTER?.target;

  const RET_VAL = {
    $match: {
      $and: [
        matchAttributeByRegex('name', FILTER_SEARCH),
        matchAttributeByRegex('_id', FILTER_AI_TRANSLATION_PROMPT_ID),
        matchAttributeByRegex('source', FILTER_SOURCE_LANG),
        matchAttributeByRegex('target', FILTER_TARGET_LANG),
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
      aiTranslationPromptId?: string,
      aiTranslationServiceId?: string,
      source?: string,
      target?: string,
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
