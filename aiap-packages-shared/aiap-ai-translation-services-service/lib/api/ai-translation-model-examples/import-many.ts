/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-ai-translation-services-service-ai-translation-model-examples-import-many';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const lodash = require('@ibm-aca/aca-wrapper-lodash');

import {
  calcDiffByValue
} from '@ibm-aiap/aiap-utils-audit';

import {
  CHANGE_ACTION, IContextV1,
} from '@ibm-aiap/aiap--types-server';

import {
  formatIntoAcaError,
  ACA_ERROR_TYPE,
  throwAcaError,
  appendDataToError
} from '@ibm-aca/aca-utils-errors';

import {
  readJsonFromFile
} from '@ibm-aiap/aiap-utils-file';

import {
  IAiTranslationModelExamplesImportManyParamsV1,
  IAiTranslationModelExamplesImportManyResponseV1
} from '../../types';

import {
  saveOne
} from './save-one';

import {
  aiTranslationModelsChangesService
} from '..';

import {
  findOneById
} from './find-one-by-id';


const importMany = async (
  context: IContextV1,
  params: IAiTranslationModelExamplesImportManyParamsV1
): Promise<IAiTranslationModelExamplesImportManyResponseV1> => {
  const CONTEXT_USER_ID = context?.user?.id;

  let file;
  let recordsFromFile;

  try {
    const AI_TRANSLATION_SERVICE_ID = params?.aiTranslationServiceId;
    const AI_TRANSLATION_MODEL_ID = params?.aiTranslationModelId;
    file = params?.file;
    recordsFromFile = await readJsonFromFile(file);
    if (
      lodash.isEmpty(recordsFromFile)
    ) {
      const MESSAGE = 'Missing required params.file paramater!';
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }
    const HAS_PROPER_FILE_STRUCTURE = recordsFromFile.every(
      record => lodash.has(record, 'source') && lodash.has(record, 'target')
    );
    if (
      !HAS_PROPER_FILE_STRUCTURE
    ) {
      const MESSAGE = `Records are not compatible for import! Records must contain 'source' and 'target' attributes!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }

    recordsFromFile.forEach((record) => {
      if (record?.serviceId !== AI_TRANSLATION_SERVICE_ID) {
        record.serviceId = AI_TRANSLATION_SERVICE_ID;
        delete record.id; // we don't want to override existing records, but rather create new ones
      }

      if (record?.modelId !== AI_TRANSLATION_MODEL_ID) {
        record.modelId = AI_TRANSLATION_MODEL_ID;
        delete record.id;
      }
    });

    const PROMISES = [];
    const CHANGES_PROMISES = [];
    for (let aiTranslationModelExample of recordsFromFile) {
      const DIFFERENCES = await calcDiffByValue(context, {
        service: {
          findOneById,
        },
        value: aiTranslationModelExample,
      });

      CHANGES_PROMISES.push(aiTranslationModelsChangesService.saveOne(
        context,
        {
          value: {
            id: aiTranslationModelExample.modelId,
            source: aiTranslationModelExample.source,
            target: aiTranslationModelExample.target,
          },
          docType: 'AI TRANSLATION MODEL EXAMPLE',
          action: CHANGE_ACTION.IMPORT_ONE,
          docChanges: DIFFERENCES,
        })
      );
      // TODO MM: throws unhandled rejection errors
      PROMISES.push(saveOne(context, { value: aiTranslationModelExample }));
    }
    await Promise.all(CHANGES_PROMISES);
    await Promise.all(PROMISES);
    const RET_VAL = {
      status: 'IMPORT SUCCESS'
    };
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
