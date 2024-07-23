/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = `aca-middleware-dialog-count-reset-counters`;
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const { formatIntoAcaError } = require('@ibm-aca/aca-utils-errors');

const resetCounters = (dialogs, dialog) => {
  try {
    for (let property in dialogs) {
      if (dialogs.hasOwnProperty(property)) {
        if (property !== dialog || !dialog) {
          dialogs[property].count = 0;
        }
      }
    }
    return dialogs;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(`${resetCounters.name}`, { ACA_ERROR });
    throw ACA_ERROR;
  }
};

module.exports = {
  resetCounters,
}
