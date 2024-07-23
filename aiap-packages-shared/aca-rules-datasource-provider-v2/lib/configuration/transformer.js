/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const ramda = require('@ibm-aca/aca-wrapper-ramda');
const lodash = require('@ibm-aca/aca-wrapper-lodash');

const datasource = (flatClient) => {
  const RET_VAL = {
    name: flatClient?.name,
    type: flatClient?.type,
    client: flatClient?.client,
    collections: {
      rulesV2: flatClient?.rulesV2,
      rulesConditionsV2: flatClient?.rulesConditionsV2,
      rulesChangesV2: flatClient?.rulesChangesV2,
    },
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
    'RULES_DATASOURCE_PROVIDER_V2',
    [
      'NAME',
      'TYPE',
      'CLIENT',
      'COLLECTION_RULES_V2',
      'COLLECTION_RULES_CONDITIONS_V2',
      'COLLECTION_RULES_CHANGES_V2',
    ]
  );
  const DATASOURCES = datasources(CLIENTS_FLAT);
  const RET_VAL = provider.isEnabled('RULES_DATASOURCE_PROVIDER_V2_ENABLED', false, {
    sources: DATASOURCES
  });
  return RET_VAL;
}

module.exports = {
  transformRawConfiguration,
}
