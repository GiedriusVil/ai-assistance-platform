/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-ai-translation-services-service-save-service-with-models-and-examples-utils';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const lodash = require('@ibm-aca/aca-wrapper-lodash');

import {
  formatIntoAcaError,
} from '@ibm-aca/aca-utils-errors';

import {
  IAiTranslationModelV1,
  IAiTranslationServiceV1,
  IContextV1,
} from '@ibm-aiap/aiap--types-server';

import {
  saveModelWithExamples
} from '../ai-translation-models';

import {
  saveOne
} from '../ai-translation-services';


const separateModelsFromService = (
  aiTranslationService: IAiTranslationServiceV1
): Array<IAiTranslationModelV1> => {
  let models = [];
  if (
    lodash.isEmpty(aiTranslationService?.models) ||
    !lodash.isArray(aiTranslationService.models)
  ) {
    return models;
  }
  models = lodash.cloneDeep(aiTranslationService.models);
  delete aiTranslationService.models;
  return models;
}

const saveServiceWithModelsAndExamples = async (
  context: IContextV1,
  aiTranslationService: IAiTranslationServiceV1
): Promise<void> => {
  const SERVICE_MODELS = separateModelsFromService(aiTranslationService);
  const AI_TRANSLATION_SERVICE_ID = aiTranslationService?.id;

  try {
    await saveOne(context, { value: aiTranslationService });
    const PROMISES = [];
    for (let model of SERVICE_MODELS) {
      PROMISES.push(saveModelWithExamples(context, model, AI_TRANSLATION_SERVICE_ID));
    }
    await Promise.all(PROMISES);
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(saveServiceWithModelsAndExamples.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

export {
  separateModelsFromService,
  saveServiceWithModelsAndExamples
}
