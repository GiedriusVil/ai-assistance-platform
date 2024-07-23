/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import ramda from '@ibm-aca/aca-wrapper-ramda';

const datasource = (
  flatClient: any
) => {
  const RET_VAL = {
    name: flatClient?.name,
    type: flatClient?.type,
    client: flatClient?.client,
    collections: {
      engagements: flatClient?.collectionEngagements,
      engagementsChanges: flatClient?.collectionEngagementsChanges
    },
  };
  return RET_VAL;
};

const datasources = (
  flatSources: any
) => {
  const RET_VAL = [];
  if (!ramda.isNil(flatSources)) {
    for (const flatSource of flatSources) {
      if (!ramda.isNil(flatSource)) {
        RET_VAL.push(datasource(flatSource));
      }
    }
  }
  return RET_VAL;
};

export const transformRawConfiguration = async (
  rawConfiguration,
  provider
) => {
  const CLIENTS_FLAT = provider.getKeys('ENGAGEMENTS_DATASOURCE_PROVIDER', [
    'NAME',
    'TYPE',
    'CLIENT',
    'COLLECTION_ENGAGEMENTS',
    'COLLECTION_ENGAGEMENTS_CHANGES',
  ]);
  const DATASOURCES = datasources(CLIENTS_FLAT);
  const RET_VAL = provider.isEnabled(
    'ENGAGEMENTS_DATASOURCE_PROVIDER_ENABLED',
    false,
    {
      sources: DATASOURCES,
    }
  );
  return RET_VAL;
};
