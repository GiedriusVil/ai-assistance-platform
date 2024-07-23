/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-utils-soe-update-sender';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import lodash from '@ibm-aca/aca-wrapper-lodash';

import {
  formatIntoAcaError,
  throwAcaError,
  ACA_ERROR_TYPE,
} from '@ibm-aca/aca-utils-errors';

import {
  ISoeUpdateV1,
  ISoeSenderV1,
} from '@ibm-aiap/aiap--types-soe';

const ensureUpdateSender = (
  update: ISoeUpdateV1,
) => {
  try {
    if (
      lodash.isEmpty(update)
    ) {
      const MESSAGE = `Missing required update parameter!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }
    if (
      lodash.isEmpty(update.sender)
    ) {
      update.sender = {};
    }
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(ensureUpdateSender.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
};

const setUpdateSender = (
  update: ISoeUpdateV1,
  sender: ISoeSenderV1
) => {
  try {
    if (
      lodash.isEmpty(update)
    ) {
      const MESSAGE = `Missing required update parameter!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }
    update.sender = sender;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(setUpdateSender.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

const getUpdateSender = (
  update: ISoeUpdateV1,
) => {
  try {
    if (
      lodash.isEmpty(update)
    ) {
      const MESSAGE = `Missing required update parameter!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }
    const RET_VAL = update?.sender;
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(getUpdateSender.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

const getUpdateSenderId = (update) => {
  try {
    const SENDER = getUpdateSender(update);
    const RET_VAL = SENDER?.id;
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(getUpdateSenderId.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

export {
  ensureUpdateSender,
  setUpdateSender,
  getUpdateSender,
  getUpdateSenderId,
}
