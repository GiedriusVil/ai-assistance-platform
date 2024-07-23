/*
	© Copyright IBM Corporation 2022. All Rights Reserved 
	 
	SPDX-License-Identifier: EPL-2.0
*/
const ramda = require('@ibm-aca/aca-wrapper-ramda');

const datasource = (flatClient) => {
  const RET_VAL = {
    name: flatClient?.name,
    type: flatClient?.type,
    client: flatClient?.client,
    collections: {
      models: flatClient?.models,
      modelsChanges: flatClient?.modelsChanges,
    },
  };
  return RET_VAL;
};

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
};

const transformRawConfiguration = async (rawConfiguration, provider) => {
  const CLIENTS_FLAT = provider.getKeys('CLASSIFIER_DATASOURCE_PROVIDER', [
    'NAME',
    'TYPE',
    'CLIENT',
    'COLLECTION_MODELS',
    'COLLECTION_MODELS_CHANGES',
  ]);
  const DATASOURCES = datasources(CLIENTS_FLAT);
  const RET_VAL = provider.isEnabled(
    'CLASSIFIER_DATASOURCE_PROVIDER_ENABLED',
    false,
    {
      sources: DATASOURCES,
    }
  );

  return RET_VAL;
};

module.exports = {
  transformRawConfiguration,
};
