/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/

const ramda = require('@ibm-aca/aca-wrapper-ramda');

const {
  matchAttributeByRegex,
} = require('@ibm-aiap/aiap-utils-mongo');

const addMatcherToPipeline = (context, params, pipeline) => {
  const FILTER = ramda.path(['filter'], params);
  const FILTER_SEARCH = ramda.path(['search'], FILTER);
  const MATCHER = {
    $match: {
      $and: [
        {
          $or: [
            matchAttributeByRegex('_id', FILTER_SEARCH),
            matchAttributeByRegex('name', FILTER_SEARCH)
          ]
        }
      ]
    },
  };
  pipeline.push(MATCHER);
}


const aggregateQuery = (context, params) => {
  const PIPELINE = [];
  addMatcherToPipeline(context, params, PIPELINE);
  return PIPELINE;
}

module.exports = {
  aggregateQuery,
}
