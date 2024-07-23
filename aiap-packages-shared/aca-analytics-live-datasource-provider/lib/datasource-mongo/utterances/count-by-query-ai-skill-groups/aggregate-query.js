/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const {
  matchFieldBetween2Dates,
  matchAttributeAssistantIdByParams,
  matchAttributeAssistantIdByContext,
  nMatchAttributeByArrayOfPrimitives
} = require('@ibm-aiap/aiap-utils-mongo');

const addParamsMatchToFilter = (context, params, pipeline) => {
  const MATCHER = {
    $match: {
      $and: [
        matchFieldBetween2Dates('timestamp', params),
        matchAttributeAssistantIdByContext(context),
        matchAttributeAssistantIdByParams(params),
        nMatchAttributeByArrayOfPrimitives('context.private.user.id', params?.query?.nFilter?.userIds),
      ]
    },
  };
  pipeline.push(MATCHER);
}


const addGroupByAiSkillToPipeline = (pipeline) => {
  const GROUP_BY_DAY = {
    $group: {
      _id: '$skillName',
      total: {
        $sum: 1
      }
    }
  }
  pipeline.push(GROUP_BY_DAY);
}

const addMatchIdNotEmptyToPipeline = (pipeline) => {
  const MATCH = {
    $match: {
      $and: [
        {
          _id: {
            $exists: true,
            $ne: null
          }
        }
      ]
    },
  };
  pipeline.push(MATCH);
}

const addFinalProjectToPipeline = (pipeline) => {
  const PROJECT_TOTAL = {
    $project: {
      _id: 0,
      aiSkill: '$_id',
      total: 1
    }
  };
  pipeline.push(PROJECT_TOTAL);
}

const aggregateQuery = (context, params) => {
  const PIPELINE = [];
  addParamsMatchToFilter(context, params, PIPELINE);
  addGroupByAiSkillToPipeline(PIPELINE);
  addMatchIdNotEmptyToPipeline(PIPELINE);
  addFinalProjectToPipeline(PIPELINE);
  return PIPELINE;
}

module.exports = {
  aggregateQuery,
}
