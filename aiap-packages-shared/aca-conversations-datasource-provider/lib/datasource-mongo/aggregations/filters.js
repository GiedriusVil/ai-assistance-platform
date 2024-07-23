/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/

/**
 * @filter utterance intents by confidence level,
 * by testing if intent's confidence is higher than a provided value
 * @returns MongoDb filter object
 */
const intentsFilter = ({ intentsArrayRef, score }) => {
  return {
    input: intentsArrayRef,
    as: 'intent',
    cond: {
      $gt: ['$$intent.score', parseFloat(score)],
    },
  };
};

/**
 * @filter utterance intents by confidence level,
 * by testing if intent's confidence is lower than a provided value
 * @returns MongoDb filter object
 */
const intentsLowConfidenceFilter = ({ intentsArrayRef, score }) => {
  return {
    input: intentsArrayRef,
    as: 'intent',
    cond: {
      $lt: ['$$intent.score', parseFloat(score)],
    },
  };
};

module.exports = {
  intentsFilter,
  intentsLowConfidenceFilter,
};
