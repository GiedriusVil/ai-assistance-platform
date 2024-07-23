/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = `aca-utils-soe-update-session-transfer`;
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import lodash from '@ibm-aca/aca-wrapper-lodash';

import {
  formatIntoAcaError,
} from '@ibm-aca/aca-utils-errors';

import {
  ISoeUpdateV1,
} from '@ibm-aiap/aiap--types-soe';

import {
  ensureUpdateSession,
} from './update-session';

const ensureUpdateSessionTransfer = (
  update: ISoeUpdateV1,
) => {
  const UPDATE_SESSION_TRANSFER = update?.session?.transfer;
  const UPDATE_SESSION_TRANSFER_DEFAULT = {};
  try {
    ensureUpdateSession(update);
    if (
      lodash.isEmpty(UPDATE_SESSION_TRANSFER)
    ) {
      setUpdateSessionTransfer(update, UPDATE_SESSION_TRANSFER_DEFAULT);
    }
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(ensureUpdateSessionTransfer.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
};

const setUpdateSessionTransfer = (
  update: ISoeUpdateV1,
  value: any,
) => {
  try {
    ensureUpdateSession(update);
    update.session.transfer = value;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(setUpdateSessionTransfer.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

const getUpdateSessionTransfer = (
  update: ISoeUpdateV1,
) => {
  try {
    const RET_VAL = update?.session?.transfer;
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(getUpdateSessionTransfer.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

export {
  ensureUpdateSessionTransfer,
  setUpdateSessionTransfer,
  getUpdateSessionTransfer,
}
