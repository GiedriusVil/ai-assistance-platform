/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-ai-translation-services-service-save-model-with-examples-utils';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const lodash = require('@ibm-aca/aca-wrapper-lodash');

import {
  IAiTranslationModelExampleV1,
  IAiTranslationModelV1,
  IContextV1,
} from '@ibm-aiap/aiap--types-server';

import {
  formatIntoAcaError,
} from '@ibm-aca/aca-utils-errors';

import {
  saveOne as modelExamplesSaveOne
} from '../ai-translation-model-examples/save-one';

import {
  saveOne
} from '../ai-translation-models';


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

export {
  separateExamplesFromModel,
  saveModelWithExamples
}
