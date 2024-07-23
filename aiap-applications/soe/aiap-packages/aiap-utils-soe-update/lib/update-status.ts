/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = `aca-utils-soe-update-status`;
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import {
  formatIntoAcaError,
} from '@ibm-aca/aca-utils-errors';

import {
  ISoeUpdateV1,
} from '@ibm-aiap/aiap--types-soe';


const setUpdateStatus = (
  update: ISoeUpdateV1,
  value: string,
) => {
  try {
    update.status = value;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(setUpdateStatus.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

const getUpdateStatus = (
  update: ISoeUpdateV1
) => {
  try {
    const RET_VAL = update?.status;
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(getUpdateStatus.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

export {
  setUpdateStatus,
  getUpdateStatus,
}
