/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'release-assistant-2022-09-31-feedbacks-transform-record';

const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { formatIntoAcaError } = require('@ibm-aca/aca-utils-errors');

const { updateDataFromConversation } = require('./update-data-from-conversation');

const transformRecord = async (configuration, db, feedback) => {
  let score;
  try {
    if (
      !lodash.isEmpty(feedback)
    ) {
      await updateDataFromConversation(configuration, db, feedback);
      score = feedback?.score;

      if (
        !lodash.isEmpty(score) &&
        lodash.isString(score)
      ) {
        switch (score) {
          case 'positive':
            feedback.score = 1;
            break;
          case 'negative':
            feedback.score = -1;
            break;
          default:
        }
      }
      feedback._processed_2022_09_28 = true;
    }
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    console.error(transformRecord.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
};

module.exports = {
  transformRecord,
}
