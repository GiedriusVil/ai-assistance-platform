/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-lambda-modules-service-configurations-import-many';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import {
  IContextV1
} from '@ibm-aiap/aiap--types-server';

import lodash from '@ibm-aca/aca-wrapper-lodash';

import { formatIntoAcaError, ACA_ERROR_TYPE, throwAcaError } from '@ibm-aca/aca-utils-errors';

import { readJsonFromFile } from '@ibm-aiap/aiap-utils-file';
import { saveOne } from './save-one';

const importMany = async (
  context: IContextV1, 
  params: {
    file: any
}) => {
  try {
    const FILE = params?.file;
    const RECORDS_FROM_FILE = await readJsonFromFile(FILE);
    if (
      lodash.isEmpty(RECORDS_FROM_FILE)
    ) {
      const MESSAGE = 'Missing lambda modules configurations in file!';
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }
    const HAS_PROPER_FILE_STRUCTURE = RECORDS_FROM_FILE.every(
      record => lodash.has(record, 'id')
    );
    if (
      !HAS_PROPER_FILE_STRUCTURE
    ) {
      const MESSAGE = `Configurations are not compatible for import! File must contain 'id'!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }
    const PROMISES = [];
    for (let moduleConfig of RECORDS_FROM_FILE) {
      PROMISES.push(saveOne(context, { value: moduleConfig }));
    }
    await Promise.all(PROMISES);
    const RET_VAL = {
      status: 'SUCCESS'
    }
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(importMany.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

export {
  importMany,
}
