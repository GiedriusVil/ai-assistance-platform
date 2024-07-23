/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = `aca-utils-soe-update-session`;
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import lodash from '@ibm-aca/aca-wrapper-lodash';

import {
  formatIntoAcaError,
} from '@ibm-aca/aca-utils-errors';

import {
  ISoeUpdateSessionV1,
  ISoeUpdateV1,
} from '@ibm-aiap/aiap--types-soe';

const ensureUpdateSession = (
  update: ISoeUpdateV1,
) => {
  const UPDATE_SESSION = update?.session;
  const UPDATE_SESSION_DEFAULT = {};
  try {
    if (
      lodash.isEmpty(UPDATE_SESSION)
    ) {
      setUpdateSesion(update, UPDATE_SESSION_DEFAULT);
    }
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(ensureUpdateSession.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
};

const setUpdateSesion = (
  update: ISoeUpdateV1,
  value: ISoeUpdateSessionV1,
) => {
  try {
    update.session = value;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(setUpdateSesion.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

const getUpdateSession = (
  update: ISoeUpdateV1,
): ISoeUpdateSessionV1 => {
  try {
    const RET_VAL = update?.session;
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(getUpdateSession.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

export {
  ensureUpdateSession,
  setUpdateSesion,
  getUpdateSession,
}
