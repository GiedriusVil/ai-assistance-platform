/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
export const QUERY_EXAMPLE_AGGREGATIONS = `
#### Aggregations
\`\`\`javascript

const { matchFieldBetween2Dates, projectField$DateToString } = require('@ibm-aiap/aiap-utils-mongo');

const aggregatePipeline = (context, params) => {
  const PIPELINE = [];
  const MATCHER = {
      $match: {
          $and: [
              {
                  $or: [
                      matchFieldBetween2Dates('start', params),
                      matchFieldBetween2Dates('end', params),
                  ]
              },
          ]
      },
  };
  const PROJECT = {
      $project: {
          _id: 0,
          start: projectField$DateToString(context?.user?.timezone, '%Y-%m-%d', '$start')
      }
  };
  const GROUP_BY_DAY = {
      $group: {
          _id: '$start',
          conv_count: {
              $sum: 1
          }
      }
  }
  const COUNT_PROJECT = {
      $project: {
          _id: 0,
          day: '$_id',
          conv_count: 1
      }
  };
  const SORTING_PARAMS = {
      $sort: { day: 1 }
  };

  PIPELINE.push(MATCHER);
  PIPELINE.push(PROJECT);
  PIPELINE.push(GROUP_BY_DAY);
  PIPELINE.push(COUNT_PROJECT);
  PIPELINE.push(SORTING_PARAMS);

  return PIPELINE;
}

const aggregations = async (context, params) =>  {
  const RET_VAL = {};

  RET_VAL.conversationsByDay = aggregatePipeline(context, params);

  return RET_VAL;
}
\`\`\`
`;
