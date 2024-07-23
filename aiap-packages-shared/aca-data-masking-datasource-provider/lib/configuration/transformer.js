/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const ramda = require('@ibm-aca/aca-wrapper-ramda');
const lodash = require('@ibm-aca/aca-wrapper-lodash');

const datasource = (flatClient) => {
  const RET_VAL = {
    name: ramda.path(['name'], flatClient),
    type: ramda.path(['type'], flatClient),
    client: ramda.path(['client'], flatClient),
    collections: {
      dataMaskingConfigurations: ramda.path(['collectionMaskingConfigurations'], flatClient),
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
    'DATA_MASKING_DATASOURCE_PROVIDER',
    [
      'NAME',
      'TYPE',
      'CLIENT',
      'COLLECTION_DATA_MASKING_CONFIGURATIONS'
    ]
  );
  const DATASOURCES = datasources(CLIENTS_FLAT);
  const RET_VAL = provider.isEnabled('DATA_MASKING_DATASOURCE_PROVIDER_ENABLED', false, {
    sources: DATASOURCES
  });
  return RET_VAL;
}

module.exports = {
  transformRawConfiguration,
}
