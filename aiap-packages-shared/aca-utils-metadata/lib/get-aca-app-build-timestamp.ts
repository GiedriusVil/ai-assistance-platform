/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = `aca-utils-metadata-get-aca-app-build-timestamp`;

import lodash from '@ibm-aca/aca-wrapper-lodash';

import { formatIntoAcaError } from '@ibm-aca/aca-utils-errors';

import { fsExtra } from '@ibm-aca/aca-wrapper-fs-extra';

const getAcaAppBuildTimestamp = () => {
  try {
    const METADATA_JSON = fsExtra.readJsonSync(`${__dirname}/metadata.json`);
    const METADATA_JSON_BUILD_TIMESTAMP = METADATA_JSON?.build?.timestamp;
    const RET_VAL: number = lodash.isNumber(METADATA_JSON_BUILD_TIMESTAMP) ? METADATA_JSON_BUILD_TIMESTAMP : 0;
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    throw ACA_ERROR;
  }
}

export {
  getAcaAppBuildTimestamp,
}
