/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import ramda from '@ibm-aca/aca-wrapper-ramda';

import {
  IShadowDatasourceConfigurationConversationsV1,
} from '../types';

const datasource = (
  flatClient: {
    name: string,
    type: string,
    client: string,
    collectionShadowConversations: string,
    collectionShadowUtterances: string,
    collectionShadowMessages: string,
  },
): IShadowDatasourceConfigurationConversationsV1 => {
  const RET_VAL = {
    name: flatClient.name,
    type: flatClient.type,
    client: flatClient.client,
    collections: {
      conversations: flatClient.collectionShadowConversations,
      utterances: flatClient.collectionShadowUtterances,
      messages: flatClient.collectionShadowMessages,
    }
  }
  return RET_VAL;
}

const datasources = (
  flatSources: Array<{
    name: string,
    type: string,
    client: string,
    collectionShadowConversations: string,
    collectionShadowUtterances: string,
    collectionShadowMessages: string,
  }>
): Array<IShadowDatasourceConfigurationConversationsV1> => {
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
}

const transformRawConfiguration = async (rawConfiguration, provider) => {
  const CLIENTS_FLAT = provider.getKeys(
    'AIAP_CONV_SHADOW_DATASOURCE_PROVIDER',
    [
      'NAME',
      'TYPE',
      'CLIENT',
      'COLLECTION_CONVERSATIONS_SHADOW',
      'COLLECTION_MESSAGES_SHADOW',
      'COLLECTION_UTTERANCES_SHADOW',
    ]
  );
  const DATASOURCES = datasources(CLIENTS_FLAT);
  const RET_VAL = provider.isEnabled('AIAP_CONV_SHADOW_DATASOURCE_PROVIDER_ENABLED', false, {
    sources: DATASOURCES
  });
  return RET_VAL;
}

export {
  transformRawConfiguration,
}
