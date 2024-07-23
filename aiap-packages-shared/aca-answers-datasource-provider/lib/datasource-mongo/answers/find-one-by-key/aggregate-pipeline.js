/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/

const lodash = require('@ibm-aca/aca-wrapper-lodash');

const matchByAssistantId = (context, params, pipeline) => {
  const MATCHER = {
    $match: {
      'assistantId': params?.assistantId,
    }
  };
  pipeline.push(MATCHER);
}

const unwindByAnswers = (pipeline) => {
  const UNWIND = {
    $unwind: '$answers'
  };
  pipeline.push(UNWIND);
}

const matchByAnswerKey = (params, pipeline) => {
  const MATCHER = {
    $match: {
      'answers.key': params?.key,
    }
  };
  pipeline.push(MATCHER);
}

const projectAnswers = (pipeline) => {
  const PROJECT = {
    $project: {
      _id: 0,
      'answers': 1
    }
  };
  pipeline.push(PROJECT);
}

const matchByReference = (params, pipeline) => {
  const MATCHER = {
    $match: {
      'reference': params?.reference,
    }
  };
  pipeline.push(MATCHER);
}


const aggregatePipeline = (context, params) => {
  const PIPELINE = [];
  matchByAssistantId(context, params, PIPELINE);
  unwindByAnswers(PIPELINE);
  matchByAnswerKey(params, PIPELINE);
  if (
    !lodash.isEmpty(params?.reference)
  ) {
    matchByReference(params, PIPELINE);
  }
  projectAnswers(PIPELINE);
  return PIPELINE;
}

module.exports = {
  aggregatePipeline,
}
