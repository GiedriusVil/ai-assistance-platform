/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-utils-soe-update-update-g-aca-props';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import {
  formatIntoAcaError,
  throwAcaError,
  ACA_ERROR_TYPE,
} from '@ibm-aca/aca-utils-errors';

import {
  ISoeGAcaPropsV1,
  ISoeUpdateV1,
} from '@ibm-aiap/aiap--types-soe';

const setUpdateGAcaProps = (
  update: ISoeUpdateV1,
  value: ISoeGAcaPropsV1,
) => {
  try {
    if (
      !update
    ) {
      const MESSAGE = `Missing required update parameter!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, MESSAGE);
    }
    update.raw.gAcaProps = value;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(setUpdateGAcaProps.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

const getUpdateGAcaProps = (
  update: ISoeUpdateV1,
) => {
  try {
    const RET_VAL = update?.raw?.gAcaProps;
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(getUpdateGAcaProps.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
};

export {
  setUpdateGAcaProps,
  getUpdateGAcaProps,
}
