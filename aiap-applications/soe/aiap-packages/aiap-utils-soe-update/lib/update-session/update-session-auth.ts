/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = `aca-utils-soe-update-session-auth`;
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import lodash from '@ibm-aca/aca-wrapper-lodash';

import {
  formatIntoAcaError,
} from '@ibm-aca/aca-utils-errors';

import {
  ISoeUpdateSessionAuthV1,
} from '@ibm-aiap/aiap--types-soe';

import {
  ISoeUpdateV1,
} from '@ibm-aiap/aiap--types-soe';

import {
  ensureUpdateSession,
} from './update-session';


const ensureUpdateSessionAuth = (
  update: ISoeUpdateV1,
) => {
  const UPDATE_SESSION_AUTH = update?.session?.auth;
  const UPDATE_SESSION_AUTH_DEFAULT = {};
  try {
    ensureUpdateSession(update);
    if (
      lodash.isEmpty(UPDATE_SESSION_AUTH)
    ) {
      setUpdateSessionAuth(update, UPDATE_SESSION_AUTH_DEFAULT);
    }
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(ensureUpdateSessionAuth.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
};

const setUpdateSessionAuth = (
  update: ISoeUpdateV1,
  value: ISoeUpdateSessionAuthV1
) => {
  try {
    update.session.auth = value;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(setUpdateSessionAuth.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

const getUpdateSessionAuth = (
  update: ISoeUpdateV1,
) => {
  try {
    const RET_VAL = update?.session?.auth;
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(getUpdateSessionAuth.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}


export {
  ensureUpdateSessionAuth,
  setUpdateSessionAuth,
  getUpdateSessionAuth,
}
