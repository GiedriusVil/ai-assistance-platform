/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const {
  matchAttributeByRegex,
  addSortCondition,
  addPagination,
  matchFieldBetween2StringDates,
  matchFieldBetween2Dates,
} = require('@ibm-aiap/aiap-utils-mongo');

const ramda = require('@ibm-aca/aca-wrapper-ramda');

const matchByAnswerStoreId = (params) => {
  const RET_VAL = {
    $match: {
      $and: [
        matchAttributeByRegex('_id', params.answerStoreId),
      ]
    },
  };
  return RET_VAL;
}

const unwindByAnswers = () => {
  const RET_VAL = {
    $unwind: {
      path: '$answers',
      includeArrayIndex: 'answer_index',
      preserveNullAndEmptyArrays: false
    },
  };
  return RET_VAL;
}

const projectAnswers = () => {
  const RET_VAL = {
    $project: {
      _id: 0,
      id: '$answers.id',
      key: '$answers.key',
      value: '$answers.value',
      values: '$answers.values',
      created: '$answers.created',
      updated: '$answers.updated',
    },
  };
  return RET_VAL;
}

const matchByKey = (params) => {
  const FILTER = params?.filter;
  const FILTER_SEARCH = FILTER?.search;
  const RET_VAL = {
    $match: {
      $and: [
        {
          $or: [
            matchFieldBetween2StringDates('updated.date', {
              queryDate: {
                from: FILTER?.dateRange?.from,
                to: FILTER?.dateRange?.to,
              }
            }),
            matchFieldBetween2Dates('updated.date', {
              queryDate: {
                from: FILTER?.dateRange?.from,
                to: FILTER?.dateRange?.to,
              }
            })
          ]
        },
        matchAttributeByRegex('key', FILTER_SEARCH),
      ]
    },
  };
  return RET_VAL;
}

const aggregateQuery = (context, params) => {
  const RET_VAL = [];
  RET_VAL.push(matchByAnswerStoreId(params));
  RET_VAL.push(unwindByAnswers());
  RET_VAL.push(projectAnswers());
  RET_VAL.push(matchByKey(params));
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

module.exports = {
  aggregateQuery,
}
