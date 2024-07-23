/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'should-skip-by-sender-action-types';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const {
  formatIntoAcaError,
  appendDataToError,
} = require('@ibm-aca/aca-utils-errors');

const lodash = require('@ibm-aca/aca-wrapper-lodash');

const shouldSkipBySenderActionTypes = (params) => {
  const UPDATE = params?.update;
  const MESSAGE = UPDATE?.raw?.message;
  const SKIP_SENDER_ACTION_TYPES = params?.skipSenderActionTypes;

  const SENDER_ACTION_TYPE = MESSAGE?.sender_action?.type;
  try {
    if (
      !lodash.isEmpty(SENDER_ACTION_TYPE) &&
      SKIP_SENDER_ACTION_TYPES.includes(SENDER_ACTION_TYPE)
    ) {
      return true;
    }

    return false;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, { MESSAGE, SKIP_SENDER_ACTION_TYPES });
    logger.error(shouldSkipBySenderActionTypes.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
};

module.exports = {
  shouldSkipBySenderActionTypes,
};
