/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'app-service-access-groups-import-many';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import lodash from '@ibm-aca/aca-wrapper-lodash';

import {
  IContextV1,
} from '@ibm-aiap/aiap--types-server';

import {
  IParamsV1ImportAccessGroups,
} from '@ibm-aiap/aiap--types-domain-app';

import {
  ACA_ERROR_TYPE,
  formatIntoAcaError,
  throwAcaError,
} from '@ibm-aca/aca-utils-errors';

import {
  readJsonFromFile,
} from '@ibm-aiap/aiap-utils-file';

import {
  saveOne,
} from './save-one';

export const importMany = async (
  context: IContextV1,
  params: IParamsV1ImportAccessGroups,
) => {
  try {
    const FILE = params?.file;
    const RECORDS_FROM_FILE = await readJsonFromFile(FILE);
    if (
      lodash.isEmpty(RECORDS_FROM_FILE)
    ) {
      const ERROR_MESSAGE = 'Missing access groups in file!';
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, ERROR_MESSAGE);
    }
    const HAS_PROPER_FILE_STRUCTURE = RECORDS_FROM_FILE.every(
      record => lodash.has(record, 'id')
    );
    if (
      !HAS_PROPER_FILE_STRUCTURE
    ) {
      const ERROR_MESSAGE = `Access groups are not compatible for import! File must contain 'id'!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, ERROR_MESSAGE);
    }
    const PROMISES = [];
    for (const ACCESS_GROUP of RECORDS_FROM_FILE) {
      PROMISES.push(saveOne(context, { value: ACCESS_GROUP }));
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
