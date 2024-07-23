/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-ai-translation-services-service-ai-translation-models-import-many';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const lodash = require('@ibm-aca/aca-wrapper-lodash');

import {
  calcDiffByValue
} from '@ibm-aiap/aiap-utils-audit';

import {
  CHANGE_ACTION,
  IAiTranslationModelExampleV1,
  IAiTranslationModelV1,
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
  AI_TRANSLATION_MODEL_STATUS
} from '@ibm-aiap/aiap-ai-translation-service-adapter-provider';

import {
  IAiTranslationModelsImportManyParamsV1,
  IAiTranslationModelsImportManyResponseV1
} from '../../types';

import {
  findOneById
} from './find-one-by-id';

import {
  saveOne
} from './save-one';

import {
  saveOne as modelExamplesSaveOne
} from '../ai-translation-model-examples/save-one';

import {
  aiTranslationModelsChangesService
} from '..';


const separateExamplesFromModel = (
  aiTranslationModel: IAiTranslationModelV1
): Array<IAiTranslationModelExampleV1> => {
  let examples = [];
  if (
    lodash.isEmpty(aiTranslationModel?.examples) ||
    !lodash.isArray(aiTranslationModel.examples)
  ) {
    return examples;
  }
  examples = lodash.cloneDeep(aiTranslationModel.examples);
  delete aiTranslationModel.examples;
  return examples;
}

const saveModelWithExamples = async (
  context: IContextV1,
  aiTranslationModel: IAiTranslationModelV1,
  aiTranslationServiceId: string
): Promise<void> => {
  const MODEL_EXAMPLES = separateExamplesFromModel(aiTranslationModel);
  const SAVED_MODEL = await saveOne(context, { value: aiTranslationModel });
  const PROMISES = [];

  try {
    for (let example of MODEL_EXAMPLES) {
      if (example.serviceId !== aiTranslationServiceId) {
        example.serviceId = aiTranslationServiceId;
        delete example.id;
      }
      example.modelId = SAVED_MODEL.id;
      PROMISES.push(modelExamplesSaveOne(context, { value: example }));
    }
    await Promise.all(PROMISES);
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(saveModelWithExamples.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

const importMany = async (
  context: IContextV1,
  params: IAiTranslationModelsImportManyParamsV1
): Promise<IAiTranslationModelsImportManyResponseV1> => {
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
      record.status = AI_TRANSLATION_MODEL_STATUS.DRAFT; // Imported models needs to be retrained 
      record.external = {};
    });

    const PROMISES = [];
    const CHANGES_PROMISES = [];
    for (let aiTranslationModel of recordsFromFile) {
      const DIFFERENCES = await calcDiffByValue(context, {
        service: {
          findOneById,
        },
        value: aiTranslationModel,
      });

      CHANGES_PROMISES.push(aiTranslationModelsChangesService.saveOne(
        context,
        {
          value: aiTranslationModel,
          action: CHANGE_ACTION.IMPORT_ONE,
          docChanges: DIFFERENCES,
        })
      );
      PROMISES.push(saveModelWithExamples(context, aiTranslationModel, AI_TRANSLATION_SERVICE_ID));
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
  saveModelWithExamples,
  importMany,
}
