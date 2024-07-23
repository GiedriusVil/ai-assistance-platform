/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-utils-soe-update-private-profile';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import lodash from '@ibm-aca/aca-wrapper-lodash';

import { ISoeUpdateV1 } from '@ibm-aiap/aiap--types-soe';

import {
  formatIntoAcaError,
  throwAcaError,
  ACA_ERROR_TYPE,
} from '@ibm-aca/aca-utils-errors';

const getUpdatePrivateProfile = (
  update: ISoeUpdateV1,
) => {
  try {
    if (
      lodash.isEmpty(update)
    ) {
      const MESSAGE = `Missing required update parameter!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, MESSAGE);
    }
    const RET_VAL = update?.private?.profile;
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(getUpdatePrivateProfile.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

export {
  getUpdatePrivateProfile,
}
