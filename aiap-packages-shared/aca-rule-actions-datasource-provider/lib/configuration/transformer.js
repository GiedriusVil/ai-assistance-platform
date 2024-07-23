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
      actions: ramda.path(['collectionRuleActions'], flatClient),
      actionsAudits: ramda.path(['collectionRuleActionsAudits'], flatClient),
    },
  };
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
    'RULE_ACTIONS_DATASOURCE_PROVIDER',
    [
      'NAME',
      'TYPE',
      'CLIENT',
      'COLLECTION_RULE_ACTIONS',
      'COLLECTION_RULE_ACTIONS_AUDITS',
    ]
  );
  const DATASOURCES = datasources(CLIENTS_FLAT);
  const RET_VAL = provider.isEnabled('RULE_ACTIONS_DATASOURCE_PROVIDER_ENABLED', false, {
    sources: DATASOURCES
  });
  return RET_VAL;
}

module.exports = {
  transformRawConfiguration,
}
