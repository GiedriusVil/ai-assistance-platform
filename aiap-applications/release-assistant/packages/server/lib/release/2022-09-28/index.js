/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'release-assistant-release-2022-09-28';

const { formatIntoAcaError } = require('@ibm-aca/aca-utils-errors');
const { run: updateSurveys } = require('./surveys');
const { run: updateFeedbacks } = require('./feedbacks');

const execute = async (config) => {
  try {
    await updateSurveys(config);
    await updateFeedbacks(config);
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    console.error(execute.name, { ACA_ERROR });
  }
};

module.exports = {
  execute,
};
