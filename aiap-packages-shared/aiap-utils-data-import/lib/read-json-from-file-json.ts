/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'utils-data-import-read-json-from-file-json';

import lodash from '@ibm-aca/aca-wrapper-lodash';

import {
  fsExtra,
} from '@ibm-aca/aca-wrapper-fs-extra';

export const readJsonFromFileJson = async (
  file: {
    path: any,
  },
) => {
  const FILE_PATH = file?.path;
  if (
    lodash.isEmpty(FILE_PATH)
  ) {
    throw new Error(`[${MODULE_ID}] Missing mandatory file.path attribute! [Actual: ${FILE_PATH}]`);
  }
  const RET_VAL = fsExtra.readJsonSync(FILE_PATH, 'utf8');
  return RET_VAL;
}
