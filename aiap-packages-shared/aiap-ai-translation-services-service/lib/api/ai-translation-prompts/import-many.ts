/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-ai-translation-services-service-ai-translation-prompts-import-many';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import lodash from '@ibm-aca/aca-wrapper-lodash';

import {
  calcDiffByValue
} from '@ibm-aiap/aiap-utils-audit';

import {
  IAiTranslationPromptV1,
  IContextV1,
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
  IAiTranslationPromptsImportManyParamsV1,
  IAiTranslationPromptsImportManyResponseV1
} from '../../types';

import {
  findOneById
} from './find-one-by-id';

import {
  saveOne
} from './save-one';


const importMany = async (
  context: IContextV1,
  params: IAiTranslationPromptsImportManyParamsV1,
): Promise<IAiTranslationPromptsImportManyResponseV1> => {
  const CONTEXT_USER_ID = context?.user?.id;

  let file;
  let recordsFromFile;

  try {
    file = params?.file;
    const AI_TRANSLATION_SERVICE_ID = params?.aiTranslationServiceId;
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

    recordsFromFile.forEach((record) => {
      if (record?.serviceId !== AI_TRANSLATION_SERVICE_ID) {
        record.serviceId = AI_TRANSLATION_SERVICE_ID;
        delete record.id; // we don't want to override existing records, but rather create new ones
      }
      record.external = {};
    });

    const PROMISES = [];
    for (let aiTranslationPrompt of recordsFromFile) {
      PROMISES.push(saveOne(context, { value: aiTranslationPrompt }));
    }
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
