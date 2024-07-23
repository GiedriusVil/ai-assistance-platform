/*
  © Copyright IBM Corporation 2023. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'release-assistant-release-2023-04-17'
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const { formatIntoAcaError } = require('@ibm-aca/aca-utils-errors');

const { run: updateRulesWithBuyerName } = require('./rules');

const execute = async (config) => {
  try {
    await updateRulesWithBuyerName(config);
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(execute.name, { ACA_ERROR });
  }
};

module.exports = {
  execute,
};
