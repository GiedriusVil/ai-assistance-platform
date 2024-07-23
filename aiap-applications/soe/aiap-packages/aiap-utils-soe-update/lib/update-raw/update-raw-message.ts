/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-utils-soe-update-raw-message';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const lodash = require('@ibm-aca/aca-wrapper-lodash');

import lodash from '@ibm-aca/aca-wrapper-lodash';

import {
  ACA_ERROR_TYPE,
  formatIntoAcaError,
  throwAcaError,
} from '@ibm-aca/aca-utils-errors';

import {
  ISoeRawMessageV1,
  ISoeUpdateV1,
} from '@ibm-aiap/aiap--types-soe';

import {
  ensureUpdateRaw,
} from './update-raw';

const ensureUpdateRawMessage = (
  update: ISoeUpdateV1,
) => {
  try {
    ensureUpdateRaw(update);
    if (
      lodash.isEmpty(update.raw.message)
    ) {
      update.raw.message = {};
    }
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(ensureUpdateRawMessage.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
};

const setUpdateRawMessage = (
  update: ISoeUpdateV1,
  message: ISoeRawMessageV1,
) => {
  try {
    ensureUpdateRaw(update);
    update.raw.message = message;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(setUpdateRawMessage.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

const getUpdateRawMessage = (update) => {
  try {
    if (
      lodash.isEmpty(update)
    ) {
      const MESSAGE = `Missing required update parameter!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }
    const RET_VAL = update?.raw?.message;
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(getUpdateRawMessage.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

export {
  ensureUpdateRawMessage,
  setUpdateRawMessage,
  getUpdateRawMessage,
}
