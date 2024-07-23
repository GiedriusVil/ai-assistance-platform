/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-utils-soe-update-raw';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import {
  formatIntoAcaError,
} from '@ibm-aca/aca-utils-errors';

import {
  ISoeUpdateV1
} from '@ibm-aiap/aiap--types-soe';

const ensureUpdateRaw = (
  update: ISoeUpdateV1,
) => {
  try {
    if (
      update &&
      !update.raw
    ) {
      update.raw = {};
    }
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(ensureUpdateRaw.name, { ACA_ERROR });
  }
};


export {
  ensureUpdateRaw,
}
