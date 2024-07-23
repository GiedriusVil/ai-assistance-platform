/*
  © Copyright IBM Corporation 2023. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'middleware-context-restore-executor-restore-context';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import lodash from '@ibm-aca/aca-wrapper-lodash';

import {
  formatIntoAcaError,
  throwAcaError,
  ACA_ERROR_TYPE,
  appendDataToError
} from '@ibm-aca/aca-utils-errors';

import {
  setUpdateSessionContext,
  getUpdateRawMessageSenderAction
} from '@ibm-aiap/aiap-utils-soe-update';

const restoreContext = (update, params) => {
  const SENDER_ACTION = getUpdateRawMessageSenderAction(update);
  const CONTEXT = params?.context;
  const STATE = params?.state;
  try {
    if (
      lodash.isEmpty(update)
    ) {
      const ERROR_MESSAGE = `Missing required update parameter!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, ERROR_MESSAGE);
    }
    if (
      lodash.isEmpty(CONTEXT)
    ) {
      const ERROR_MESSAGE = `Missing required context parameter!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, ERROR_MESSAGE);
    }
    if (
      lodash.isEmpty(STATE)
    ) {
      const ERROR_MESSAGE = `Missing required state parameter!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, ERROR_MESSAGE);
    }
    if (
      !lodash.isEmpty(SENDER_ACTION)
    ) {
      CONTEXT.sender_action = SENDER_ACTION;
    }
    update.session.state = STATE;
    setUpdateSessionContext(update, CONTEXT);
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, { CONTEXT, STATE });
    logger.error(`${restoreContext.name}`, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

export {
  restoreContext,
}
