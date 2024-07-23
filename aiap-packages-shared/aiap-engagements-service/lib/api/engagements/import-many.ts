/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-engagements-service-engagements-import-many';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import lodash from '@ibm-aca/aca-wrapper-lodash';

import {
  CHANGE_ACTION,
  IContextV1,
} from '@ibm-aiap/aiap--types-server';

import {
  ACA_ERROR_TYPE,
  formatIntoAcaError,
  throwAcaError,
} from '@ibm-aca/aca-utils-errors';

import {
  readJsonFromFile,
} from '@ibm-aiap/aiap-utils-file';

import {
  calcDiffByValue,
} from '@ibm-aiap/aiap-utils-audit';

import {
  findOneById,
} from './find-one-by-id';

import {
  saveOne,
} from './save-one';

import * as engagementsChangesService from '../engagements-changes';

export const importMany = async (
  context: IContextV1,
  params: {
    file: any
  }
): Promise<{ status: string }> => {
  try {
    const FILE = params?.file;
    const RECORDS_FROM_FILE = await readJsonFromFile(FILE);
    if (
      lodash.isEmpty(RECORDS_FROM_FILE)
    ) {
      const MESSAGE = 'Missing engagements in file!';
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }
    const HAS_PROPER_FILE_STRUCTURE = RECORDS_FROM_FILE.every(
      record => lodash.has(record, 'id')
    );
    if (
      !HAS_PROPER_FILE_STRUCTURE
    ) {
      const MESSAGE = `Engagements are not compatible for import! File must contain 'id'!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }
    const PROMISES = [];
    const CHANGES_PROMISES = [];

    for (const ENGAGEMENT of RECORDS_FROM_FILE) {

      const DIFFERENCES = await calcDiffByValue(context, {
        service: {
          findOneById,
        },
        value: ENGAGEMENT,
      });

      CHANGES_PROMISES.push(engagementsChangesService.saveOne(
        context,
        {
          value: ENGAGEMENT,
          action: CHANGE_ACTION.IMPORT_MANY,
          docChanges: DIFFERENCES,
        })
      );
      PROMISES.push(saveOne(context, { value: ENGAGEMENT }));
    }
    await Promise.all(CHANGES_PROMISES);
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
