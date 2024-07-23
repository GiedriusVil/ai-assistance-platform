/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const {
  matchAttributeByRegex,
} = require('@ibm-aiap/aiap-utils-mongo');

const ramda = require('@ibm-aca/aca-wrapper-ramda');

const unwindByAnswers = () => {
  const RET_VAL = {
    $unwind: '$answers'
  };
  return RET_VAL;
}

const matchByActionTagId = (params) => {
  const RET_VAL = {
    $match: {
      $and: [
        matchAttributeByRegex('answers.values.text', `<${params.moduleId} `)
      ]
    },
  };
  return RET_VAL;
}

const groupAnswers = () => {
  const RET_VAL = {
    $group: {
      _id: null,
      answers: {
        $push: {
          answerKey: '$answers.key',
          answerStore: '$name',
          id: '$_id'
        }
      }
    },
  };
  return RET_VAL;
}

const aggregateQuery = (context, params) => {
  const RET_VAL = [];
  RET_VAL.push(unwindByAnswers())
  RET_VAL.push(matchByActionTagId(params));
  RET_VAL.push(groupAnswers());
  return RET_VAL;
}

module.exports = {
  aggregateQuery,
}
