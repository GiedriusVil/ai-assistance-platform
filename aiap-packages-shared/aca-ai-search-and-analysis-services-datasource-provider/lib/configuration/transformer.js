/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const ramda = require('@ibm-aca/aca-wrapper-ramda');

const datasource = (flatClient) => {
  const RET_VAL = {
    name: ramda.path(['name'], flatClient),
    type: ramda.path(['type'], flatClient),
    client: ramda.path(['client'], flatClient),
    encryptionKey: ramda.pathOr('someKey', ['encryptionKey'], flatClient),
    collections: {
      aiSearchAndAnalysisServices: ramda.path(['collectionAiSearchAndAnalysisServices'], flatClient),
      aiSearchAndAnalysisProjects: ramda.path(['collectionAiSearchAndAnalysisProjects'], flatClient),
      aiSearchAndAnalysisCollections: ramda.path(['collectionAiSearchAndAnalysisCollections'], flatClient),
    }
  }
  return RET_VAL;
}

const datasources = (flatSources) => {
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

const transformRawConfiguration = async (rawConfiguration, provider) => {
  const CLIENTS_FLAT = provider.getKeys(
    'AI_SEARCH_AND_ANALYSIS_SERVICES_DATASOURCE_PROVIDER',
    [
      'NAME',
      'TYPE',
      'CLIENT',
      'ENCRYPTION_KEY',
      'COLLECTION_AI_SEARCH_AND_ANALYSIS_SERVICES',
      'COLLECTION_AI_SEARCH_AND_ANALYSIS_PROJECTS',
      'COLLECTION_AI_SEARCH_AND_ANALYSIS_EXAMPLES',
    ]
  );
  const DATASOURCES = datasources(CLIENTS_FLAT);
  const RET_VAL = provider.isEnabled('AI_SEARCH_AND_ANALYSIS_SERVICES_DATASOURCE_PROVIDER_ENABLED', false, {
    sources: DATASOURCES
  });
  return RET_VAL;
}

module.exports = {
  transformRawConfiguration,
}
