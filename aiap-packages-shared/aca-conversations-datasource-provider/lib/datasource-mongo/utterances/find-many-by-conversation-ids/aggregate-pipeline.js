/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const {
  matchAttributeByArrayOfPrimitives,
  matchByAttribute,
  matchAttributeArrayLessThanValue,
  nMatchByAttribute
} = require('@ibm-aiap/aiap-utils-mongo');


const utterancesMatcher = (context, params) => {
  const CONVERRSATIONS_IDS = params?.conversationsIds;
  const CONFIDENCE_RATE = params?.confidenceRate;
  const RET_VAL = {
    $match: {
      $and: [
        {
          $or: [
            matchAttributeByArrayOfPrimitives('conversationId', CONVERRSATIONS_IDS),
          ]
        },
        matchByAttribute('source', 'USER'),
        nMatchByAttribute('message', ''),
        matchAttributeArrayLessThanValue('aiServiceResponse.external.result.intents', 'confidence', CONFIDENCE_RATE),
      ]
    },
  };
  return RET_VAL;
}


const groupMessages = () => {
  const RET_VAL = {
    $group: {
      _id: null,
      messages: {
        $push: {
          text: '$message',
          id: '$_id'
        }
      }
    },
  };
  return RET_VAL;
}

const projectMessages = () => {
  const RET_VAL = {
    $project: {
      messages: '$messages',
      count: {
        $size: '$messages'
      },
      _id: 0
    }
  };
  return RET_VAL;
}

/**
 * Generates aggregation pipeline for ordered list of conversations based on start/end dates or conversation id.
 * Supported query params:
 *  - from: start date
 *  - to: end date
 *  - size: number of items to be returned
 *  - page: page number
 *  - field: sort field
 *  - sort: sorting order
 *  - conversationId: conversation id
 * @param {*} params Query parameters
 * @returns {*} Mongo aggregation pipeline
 */
const aggregatePipeline = (datasource, context, params) => {
  const RET_VAL = [
    utterancesMatcher(context, params),
    groupMessages(),
    projectMessages()
  ];
  return RET_VAL;
}

module.exports = {
  aggregatePipeline
};
