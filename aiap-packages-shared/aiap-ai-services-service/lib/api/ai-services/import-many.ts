/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-ai-services-service-ai-services-import-many';
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
  appendDataToError,
} from '@ibm-aca/aca-utils-errors';

import {
  calcDiffByValue,
} from '@ibm-aiap/aiap-utils-audit';

import {
  readJsonFromFile,
} from '@ibm-aiap/aiap-utils-file';

import {
  findOneById,
} from './find-one-by-id';

import {
  saveOne,
} from './save-one';

import * as aiServicesChangesService from '../ai-services-changes';

export const importMany = async (
  context: IContextV1,
  params: {
    file: any,
  }
) => {
  const CONTEXT_USER_ID = context?.user?.id;

  let aiServices: Array<any>;

  try {
    aiServices = await readJsonFromFile(params?.file);
    if (
      lodash.isEmpty(aiServices)
    ) {
      const MESSAGE = 'Unable to read aiServices from params?.file!';
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }
    const HAS_PROPER_FILE_STRUCTURE = aiServices.every(
      record => lodash.has(record, 'id')
    );
    if (
      !HAS_PROPER_FILE_STRUCTURE
    ) {
      const MESSAGE = `Records are not compatible for import! Records must contain 'id' attribute!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }
    const PROMISES = [];
    const CHANGES_PROMISES = [];
    for (const AI_SERVICE of aiServices) {
      const DIFFERENCES = await calcDiffByValue(context, {
        service: {
          findOneById,
        },
        value: AI_SERVICE,
      });
      CHANGES_PROMISES.push(aiServicesChangesService.saveOne(context, {
        value: AI_SERVICE,
        action: CHANGE_ACTION.IMPORT_MANY,
        docChanges: DIFFERENCES,
      }));
      PROMISES.push(saveOne(context, { value: AI_SERVICE }));
    }
    await Promise.all(CHANGES_PROMISES);
    await Promise.all(PROMISES);
    const RET_VAL = {
      status: 'IMPORT SUCCESS'
    }
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, { CONTEXT_USER_ID });
    logger.error(importMany.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}
