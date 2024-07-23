/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-utils-soe-update-update-context';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import {
  formatIntoAcaError,
  throwAcaError,
  ACA_ERROR_TYPE,
} from '@ibm-aca/aca-utils-errors';

import {
  ISoeUpdateContextV1,
  ISoeUpdateV1,
} from '@ibm-aiap/aiap--types-soe';

const setUpdateContext = (
  update: ISoeUpdateV1,
  value: ISoeUpdateContextV1,
) => {
  try {
    if (
      !update
    ) {
      const MESSAGE = `Missing required update parameter!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, MESSAGE);
    }
    update.context = value;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(setUpdateContext.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

const getUpdateContext = (
  update: ISoeUpdateV1,
): ISoeUpdateContextV1 => {
  try {
    const RET_VAL = update?.context;
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(getUpdateContext.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
};

export {
  setUpdateContext,
  getUpdateContext,
}
