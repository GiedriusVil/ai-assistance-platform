/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'release-assistant-2022-09-31-surveys-transform-record';

const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { formatIntoAcaError } = require('@ibm-aca/aca-utils-errors');

const { updateDataFromConversation } = require('./update-data-from-conversation');

const transformRecord = async (configuration, db, survey) => {
  let score;
  try {
    if (
      !lodash.isEmpty(survey)
    ) {
      await updateDataFromConversation(configuration, db, survey);
      score = survey?.score;
      if (
        !lodash.isEmpty(score) &&
        lodash.isString(score)
      ) {
        switch (score) {
          case 'Very Dissatisfied':
            survey.score = -2;
            break;
          case 'Erittäin tyytymätön':
            survey.score = -2;
            break;
          case 'Dissatisfied':
            survey.score = -1;
            break;
          case 'Tyytymätön':
            survey.score = -1;
            break;
          case 'Neutral':
            survey.score = 0;
            break;
          case 'Neutraali':
            survey.score = 0;
            break;
          case 'Satisfied':
            survey.score = 1;
            break;
          case 'Tyytyväinen':
            survey.score = 1;
            break;
          case 'Very Satisfied':
            survey.score = 2;
            break;
          case 'Erittäin tyytyväinen':
            survey.score = 2;
            break;
          default:
            break;
        }
      }
      survey._processed_2022_09_28 = true;
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
