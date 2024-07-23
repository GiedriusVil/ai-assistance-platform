/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import ramda from '@ibm-aca/aca-wrapper-ramda';

import {
  IDatasourceConfigurationAITranslationServicesV1
} from '../types';

const datasource = (
  flatClient: {
    name: string,
    type: string,
    client: string,
    encryptionKey: string,
    collectionAiTranslationServices: string,
    collectionAiTranslationServicesChanges: string,
    collectionAiTranslationModels: string,
    collectionAiTranslationModelsChanges: string,
    collectionAiTranslationModelExamples: string
    collectionAiTranslationPrompts: string
  }): IDatasourceConfigurationAITranslationServicesV1 => {
  const RET_VAL = {
    name: flatClient?.name,
    type: flatClient?.type,
    client: flatClient?.client,
    encryptionKey: flatClient?.encryptionKey || 'someKey',
    collections: {
      aiTranslationServices: flatClient?.collectionAiTranslationServices,
      aiTranslationServicesChanges: flatClient?.collectionAiTranslationServicesChanges,
      aiTranslationModels: flatClient?.collectionAiTranslationModels,
      aiTranslationModelsChanges: flatClient?.collectionAiTranslationModelsChanges,
      aiTranslationModelExamples: flatClient?.collectionAiTranslationModelExamples,
      aiTranslationPrompts: flatClient?.collectionAiTranslationPrompts,
    }
  }
  return RET_VAL;
}

const datasources = (
  flatSources: Array<{
    name: string,
    type: string,
    client: string,
    encryptionKey: string,
    collectionAiTranslationServices: string,
    collectionAiTranslationServicesChanges: string,
    collectionAiTranslationModels: string,
    collectionAiTranslationModelsChanges: string,
    collectionAiTranslationModelExamples: string
    collectionAiTranslationPrompts: string
  }>
): Array<IDatasourceConfigurationAITranslationServicesV1> => {
  const RET_VAL = [];
  if (!ramda.isNil(flatSources)) {
    for (let flatSource of flatSources) {
      if (!ramda.isNil(flatSource)) {
        RET_VAL.push(datasource(flatSource));
      }
    }
  }
  return RET_VAL;
}

const transformRawConfiguration = async (
  rawConfiguration,
  provider
): Promise<{
  sources: Array<IDatasourceConfigurationAITranslationServicesV1>
}> => {
  const CLIENTS_FLAT = provider.getKeys(
    'AI_TRANSLATION_SERVICES_DATASOURCE_PROVIDER',
    [
      'NAME',
      'TYPE',
      'CLIENT',
      'ENCRYPTION_KEY',
      'COLLECTION_AI_TRANSLATION_SERVICES',
      'COLLECTION_AI_TRANSLATION_SERVICES_CHANGES',
      'COLLECTION_AI_TRANSLATION_MODELS',
      'COLLECTION_AI_TRANSLATION_MODEL_EXAMPLES',
    ]
  );
  const DATASOURCES = datasources(CLIENTS_FLAT);
  const RET_VAL = provider.isEnabled('AI_TRANSLATION_SERVICES_DATASOURCE_PROVIDER_ENABLED', false, {
    sources: DATASOURCES
  });
  return RET_VAL;
}

export {
  transformRawConfiguration,
}
