/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-utils-soe-update-message-text';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import lodash from '@ibm-aca/aca-wrapper-lodash';

import {
  ACA_ERROR_TYPE,
  formatIntoAcaError,
  throwAcaError,
} from '@ibm-aca/aca-utils-errors';

import {
  ISoeUpdateV1,
} from '@ibm-aiap/aiap--types-soe';

import {
  ensureUpdateRawMessage,
} from './update-raw-message';

const setUpdateRawMessageText = (
  update: ISoeUpdateV1,
  text: string,
) => {
  try {
    ensureUpdateRawMessage(update);
    update.raw.message.text = text;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(setUpdateRawMessageText.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
};

const getUpdateRawMessageText = (
  update: ISoeUpdateV1,
) => {
  try {
    if (
      lodash.isEmpty(update)
    ) {
      const MESSAGE = `Missing required update parameter!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, MESSAGE);
    }
    const RET_VAL = update?.raw?.message?.text;
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(getUpdateRawMessageText.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
};


export {
  setUpdateRawMessageText,
  getUpdateRawMessageText,
}
