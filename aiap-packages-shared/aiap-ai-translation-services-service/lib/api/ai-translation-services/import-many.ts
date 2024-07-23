/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-ai-translation-services-service-ai-translation-services-import-many';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const lodash = require('@ibm-aca/aca-wrapper-lodash');

import {
  formatIntoAcaError,
  ACA_ERROR_TYPE,
  throwAcaError,
  appendDataToError
} from '@ibm-aca/aca-utils-errors';

import {
  CHANGE_ACTION, IContextV1
} from '@ibm-aiap/aiap--types-server';

import {
  calcDiffByValue,
} from '@ibm-aiap/aiap-utils-audit';

import {
  readJsonFromFile
} from '@ibm-aiap/aiap-utils-file';

import {
  IAiTranslationServicesImportManyParamsV1,
  IAiTranslationServicesImportManyResponseV1
} from '../../types';

import {
  findOneById
} from './find-one-by-id';

import {
  aiTranslationServicesChangesService
} from '..';

import {
  saveServiceWithModelsAndExamples
} from '../utils';


const importMany = async (
  context: IContextV1,
  params: IAiTranslationServicesImportManyParamsV1
  ): Promise<IAiTranslationServicesImportManyResponseV1> => {
  const CONTEXT_USER_ID = context?.user?.id;

  let file;
  let recordsFromFile;

  try {
    file = params?.file;
    recordsFromFile = await readJsonFromFile(file);
    
    if (
      lodash.isEmpty(recordsFromFile)
    ) {
      const MESSAGE = 'Missing required params.file paramater!';
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }
    const HAS_PROPER_FILE_STRUCTURE = recordsFromFile.every(
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

    for (let aiTranslationService of recordsFromFile) {
      const DIFFERENCES = await calcDiffByValue(context, {
        service: {
          findOneById,
        },
        value: aiTranslationService,
      });

      CHANGES_PROMISES.push(aiTranslationServicesChangesService.saveOne(
        context,
        {
          value: aiTranslationService,
          action: CHANGE_ACTION.IMPORT_ONE,
          docChanges: DIFFERENCES,
        })
      );

      PROMISES.push(saveServiceWithModelsAndExamples(context, aiTranslationService));
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
    logger.error(`${importMany.name}`, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

export {
  importMany,
}
