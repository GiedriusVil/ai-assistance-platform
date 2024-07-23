/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-utils-soe-messages-message-errors';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import ramda from '@ibm-aca/aca-wrapper-ramda';
import lodash from '@ibm-aca/aca-wrapper-lodash';

import {
  formatIntoAcaError,
} from '@ibm-aca/aca-utils-errors';

const ensureMessageErrors = (
  message: any,
) => {
  try {
    if (
      !message.errors
    ) {
      message.errors = [];
    }
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(ensureMessageErrors.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

const copyMessageErrors = (
  source: any,
  target: any,
) => {
  try {
    ensureMessageErrors(source);
    const ERRORS = ramda.pathOr([], ['errors'], source);


    for (const ERROR of ERRORS) {
      if (
        !lodash.isEmpty(ERROR)
      ) {
        addErrorToMessage(target, ERROR);
      }
    }

  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(copyMessageErrors.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

const addErrorToMessage = (
  message: any,
  error: any,
) => {
  try {
    ensureMessageErrors(message);
    message.errors.push(error);
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(addErrorToMessage.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

export {
  ensureMessageErrors,
  copyMessageErrors,
  addErrorToMessage,
}
