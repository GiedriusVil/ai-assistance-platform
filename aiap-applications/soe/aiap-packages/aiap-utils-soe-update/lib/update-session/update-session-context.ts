/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = `aca-utils-soe-update-session-context`;
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const lodash = require('@ibm-aca/aca-wrapper-lodash');

import {
  ISoeUpdateV1,
  ISoeUpdateSessionContextV1,
} from '@ibm-aiap/aiap--types-soe';

import {
  formatIntoAcaError,
  appendDataToError,
} from '@ibm-aca/aca-utils-errors';

import {
  ensureUpdateSession,
} from './update-session';

const ensureUpdateSessionContext = (
  update: ISoeUpdateV1,
) => {
  const UPDATE_SESSION_CONTEXT = update?.session?.context;
  const UPDATE_SESSION_CONTEXT_DEFAULT = {};
  try {
    ensureUpdateSession(update);
    if (
      lodash.isEmpty(UPDATE_SESSION_CONTEXT)
    ) {
      setUpdateSessionContext(update, UPDATE_SESSION_CONTEXT_DEFAULT);
    }
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, { UPDATE_SESSION_CONTEXT });
    logger.error(ensureUpdateSessionContext.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
};

const setUpdateSessionContext = (
  update: ISoeUpdateV1,
  value: ISoeUpdateSessionContextV1
) => {
  try {
    ensureUpdateSession(update);
    update.session.context = value;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(setUpdateSessionContext.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

const getUpdateSessionContext = (
  update: ISoeUpdateV1,
) => {
  try {
    const RET_VAL = update?.session?.context;
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(getUpdateSessionContext.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}


export {
  ensureUpdateSessionContext,
  setUpdateSessionContext,
  getUpdateSessionContext,
}
