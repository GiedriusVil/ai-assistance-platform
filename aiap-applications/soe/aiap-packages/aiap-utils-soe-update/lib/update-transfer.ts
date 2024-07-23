/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = `aca-utils-soe-update-transfer`;
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import lodash from '@ibm-aca/aca-wrapper-lodash';

import {
  formatIntoAcaError,
} from '@ibm-aca/aca-utils-errors';

import {
  ISoeUpdateV1,
} from '@ibm-aiap/aiap--types-soe';

const ensureUpdateTransfer = (update) => {
  const UPDATE_TRANSFER = update?.transfer;
  const UPDATE_TRANSFER_DEFAULT = {};
  try {
    if (
      lodash.isEmpty(UPDATE_TRANSFER)
    ) {
      setUpdateTransfer(update, UPDATE_TRANSFER_DEFAULT);
    }
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(`${ensureUpdateTransfer.name}`, { ACA_ERROR });
    throw ACA_ERROR;
  }
};

const setUpdateTransfer = (update, value) => {
  try {
    update.transfer = value;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(`${setUpdateTransfer.name}`, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

const getUpdateTransfer = (
  update: ISoeUpdateV1,
) => {
  try {
    const RET_VAL = update?.transfer;
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(`${getUpdateTransfer.name}`, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

export {
  ensureUpdateTransfer,
  setUpdateTransfer,
  getUpdateTransfer,
}
