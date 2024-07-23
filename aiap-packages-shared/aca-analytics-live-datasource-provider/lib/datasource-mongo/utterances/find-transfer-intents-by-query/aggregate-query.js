/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const ramda = require('@ibm-aca/aca-wrapper-ramda');

const {
  matchFieldBetween2Dates,
  matchAttributeAssistantIdByParams,
  matchAttributeAssistantIdByContext,
  nMatchAttributeByArrayOfPrimitives
} = require('@ibm-aiap/aiap-utils-mongo');

const addMatcherToPipeline = (context, params, pipeline) => {
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

const addTransfersFieldToPipeline = (pipeline) => {
  const ADD_FIELDS = {
    $addFields: {
      transfers: {
        $reduce: {
          input: {
            $regexFindAll: {
              input: '$response.text',
              // TODO -> We need generalise this place
              regex: /(< *cohHandover.*?\/.*?>)|(< *s2pTransfer2Agent.*?\/.*?>)|(< *s2pTransfer2Bot.*?\/.*?>)|( *key="ohjaa_asiakaspalvelijalle_auki_siirtyminen".*?\/.*?)/g
            }
          },
          initialValue: 0,
          in: {
            $add: ['$$value', 1]
          }
        }
      }
    }
  }
  pipeline.push(ADD_FIELDS);
}

const addGroupTopIntentToPipeline = (pipeline) => {
  const GROUP = {
    $group: {
      _id: '$topIntent',
      count: {
        $sum: '$transfers'
      }
    }
  };
  pipeline.push(GROUP);
}

const addMatchOnlyTransfersToPipeline = (pipeline) => {
  const MATCH = {
    '$match': {
      'count': {
        '$gt': 0
      }
    }
  };
  pipeline.push(MATCH);
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

const addSortByCountDescendingToPipeline = (pipeline) => {
  const SORT = {
    $sort: {
      count: -1
    }
  };
  pipeline.push(SORT);
}

const addLimitToPipeline = (context, params, pipeline) => {
  const LIMIT = {
    $limit: ramda.pathOr(5, ['limit'], params),
  };
  pipeline.push(LIMIT);
}



const addFinalProject = (pipeline) => {
  const PROJECT = {
    $project: {
      _id: 0,
      intent: '$_id',
      total: '$count'
    }
  };
  pipeline.push(PROJECT);
}

const aggregateQuery = (context, params) => {
  const PIPELINE = [];
  addMatcherToPipeline(context, params, PIPELINE);
  addTransfersFieldToPipeline(PIPELINE);
  addGroupTopIntentToPipeline(PIPELINE);
  addMatchOnlyTransfersToPipeline(PIPELINE);
  addMatchIdNotEmptyToPipeline(PIPELINE);
  addSortByCountDescendingToPipeline(PIPELINE);
  addLimitToPipeline(context, params, PIPELINE);
  addFinalProject(PIPELINE);
  return PIPELINE;
}

module.exports = {
  aggregateQuery,
}
