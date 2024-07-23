/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-ai-translation-services-datasource-mongo-collections-utils';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import lodash from '@ibm-aca/aca-wrapper-lodash';

import {
  formatIntoAcaError,
} from '@ibm-aca/aca-utils-errors';

import {
  IDatasourceAITranslationServicesCollectionsV1,
  IDatasourceConfigurationAITranslationServicesV1
} from '../types';

const DEFAULT_COLLECTIONS = {
  aiTranslationServices: 'aiLangTranslationServices',
  aiTranslationServicesChanges: 'aiLangTranslationServicesChanges',
  aiTranslationModels: 'aiLangTranslationModels',
  aiTranslationModelsChanges: 'aiLangTranslationModelsChanges',
  aiTranslationModelExamples: 'aiLangTranslationModelExamples',
  aiTranslationPrompts: 'aiLangTranslationPrompts',
};

const sanitizedCollectionsFromConfiguration = (
  configuration: IDatasourceConfigurationAITranslationServicesV1,
): IDatasourceAITranslationServicesCollectionsV1 => {
  try {
    const COLLECTIONS_CONFIGURATION = configuration?.collections;

    const AI_TRANSLATION_SERVICES = COLLECTIONS_CONFIGURATION?.aiTranslationServices;
    const AI_TRANSLATION_SERVICES_CHANGES = COLLECTIONS_CONFIGURATION?.aiTranslationServicesChanges;
    const AI_TRANSLATION_MODELS = COLLECTIONS_CONFIGURATION?.aiTranslationModels;
    const AI_TRANSLATION_MODELS_CHANGES = COLLECTIONS_CONFIGURATION?.aiTranslationModelsChanges;
    const AI_TRANSLATION_MODEL_EXAMPLES = COLLECTIONS_CONFIGURATION?.aiTranslationModelExamples;
    const AI_TRANSLATION_PROMPTS = COLLECTIONS_CONFIGURATION?.aiTranslationPrompts;

    const RET_VAL = lodash.cloneDeep(DEFAULT_COLLECTIONS);
    if (
      !lodash.isEmpty(AI_TRANSLATION_SERVICES)
    ) {
      RET_VAL.aiTranslationServices = AI_TRANSLATION_SERVICES;
    }
    if (
      !lodash.isEmpty(AI_TRANSLATION_SERVICES_CHANGES)
    ) {
      RET_VAL.aiTranslationServices = AI_TRANSLATION_SERVICES_CHANGES;
    }
    if (
      !lodash.isEmpty(AI_TRANSLATION_MODELS)
    ) {
      RET_VAL.aiTranslationModels = AI_TRANSLATION_MODELS;
    }
    if (
      !lodash.isEmpty(AI_TRANSLATION_MODELS_CHANGES)
    ) {
      RET_VAL.aiTranslationModels = AI_TRANSLATION_MODELS_CHANGES;
    }
    if (
      !lodash.isEmpty(AI_TRANSLATION_MODEL_EXAMPLES)
    ) {
      RET_VAL.aiTranslationModelExamples = AI_TRANSLATION_MODEL_EXAMPLES;
    }
    if (
      !lodash.isEmpty(AI_TRANSLATION_PROMPTS)
    ) {
      RET_VAL.aiTranslationPrompts = AI_TRANSLATION_PROMPTS;
    }

    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(sanitizedCollectionsFromConfiguration.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}


export {
  sanitizedCollectionsFromConfiguration,
};
