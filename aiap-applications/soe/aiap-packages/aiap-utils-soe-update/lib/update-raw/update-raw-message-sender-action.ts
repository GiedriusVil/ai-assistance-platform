/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-utils-soe-update-update-message-sender-action';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import lodash from '@ibm-aca/aca-wrapper-lodash';

import {
  formatIntoAcaError,
  throwAcaError,
  ACA_ERROR_TYPE,
} from '@ibm-aca/aca-utils-errors';

import {
  ISoeUpdateV1,
} from '@ibm-aiap/aiap--types-soe';

const getUpdateRawMessageSenderAction = (
  update: ISoeUpdateV1,
) => {
  try {
    if (
      lodash.isEmpty(update)
    ) {
      const MESSAGE = `Missing required update parameter!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, MESSAGE);
    }
    const RET_VAL = update?.raw?.message?.sender_action;
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(getUpdateRawMessageSenderAction.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
};


export {
  getUpdateRawMessageSenderAction,
}
