/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import ramda from '@ibm-aca/aca-wrapper-ramda';

const datasource = (
  flatClient: any,
) => {
  const RET_VAL = {
    name: flatClient?.name,
    type: flatClient?.type,
    client: flatClient?.client,
    encryptionKey: ramda.pathOr('someKey', ['encryptionKey'], flatClient),
    collections: {
      aiServices: flatClient?.collectionAiServices,
      aiServicesChanges: flatClient?.aiServicesChanges,
      aiServicesChangeRequest: flatClient?.aiServicesChangeRequest,
      aiSkillReleases: flatClient?.collectionAiSkillReleases,
      aiServiceTests: flatClient?.collectionAiServiceTests,
    },
  };
  return RET_VAL;
};

const datasources = (
  flatSources: any,
) => {
  const RET_VAL = [];
  if (
    !ramda.isNil(flatSources)
  ) {
    for (const FLAT_SOURCE of flatSources) {
      if (
        !ramda.isNil(FLAT_SOURCE)
      ) {
        RET_VAL.push(datasource(FLAT_SOURCE));
      }
    }
  }
  return RET_VAL;
};

export const transformRawConfiguration = async (
  rawConfiguration,
  provider,
) => {
  const CLIENTS_FLAT = provider.getKeys('AI_SERVICES_DATASOURCE_PROVIDER', [
    'NAME',
    'TYPE',
    'CLIENT',
    'ENCRYPTION_KEY',
    'COLLECTION_AI_SERVICES',
    'COLLECTION_AI_SERVICES_CHANGES',
    'COLLECTION_AI_SKILL_RELEASES',
    'COLLECTION_AI_SERVICE_TESTS',
  ]);
  const DATASOURCES = datasources(CLIENTS_FLAT);
  const RET_VAL = provider.isEnabled(
    'AI_SERVICES_DATASOURCE_PROVIDER_ENABLED',
    false,
    {
      sources: DATASOURCES,
    }
  );
  return RET_VAL;
}
