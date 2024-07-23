/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = `aca-utils-soe-update-session-state`;
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const lodash = require('@ibm-aca/aca-wrapper-lodash');

import {
  formatIntoAcaError,
  appendDataToError,
} from '@ibm-aca/aca-utils-errors';

import {
  ISoeUpdateSessionStateV1,
  ISoeUpdateV1,
} from '@ibm-aiap/aiap--types-soe';

import {
  ensureUpdateSession,
} from './update-session';

const ensureUpdateSessionState = (
  update: ISoeUpdateV1,
) => {
  const UPDATE_SESSION_STATE = update?.session?.state;
  const UPDATE_SESSION_STATE_DEFAULT = {};
  try {
    ensureUpdateSession(update);
    if (
      lodash.isEmpty(UPDATE_SESSION_STATE)
    ) {
      setUpdateSessionState(update, UPDATE_SESSION_STATE_DEFAULT);
    }
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, { UPDATE_SESSION_STATE });
    logger.error(ensureUpdateSessionState.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
};

const setUpdateSessionState = (
  update: ISoeUpdateV1,
  value: ISoeUpdateSessionStateV1,
) => {
  try {
    ensureUpdateSession(update);
    update.session.state = value;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(setUpdateSessionState.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

const getUpdateSessionState = (
  update: ISoeUpdateV1,
) => {
  try {
    ensureUpdateSessionState(update);
    const RET_VAL = update?.session?.state;
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(getUpdateSessionState.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}


export {
  ensureUpdateSessionState,
  setUpdateSessionState,
  getUpdateSessionState,
}
