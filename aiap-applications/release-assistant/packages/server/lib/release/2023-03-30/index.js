/*
  © Copyright IBM Corporation 2023. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'release-assistant-release-2023-03-30'
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const { formatIntoAcaError } = require('@ibm-aca/aca-utils-errors');

const { run: updateDocValidationsWithActionId } = require('./doc-validations');

const execute = async (config) => {
  try {
    await updateDocValidationsWithActionId(config);
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(execute.name, { ACA_ERROR });
  }
};

module.exports = {
  execute,
};
