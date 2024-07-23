/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import ramda from '@ibm-aca/aca-wrapper-ramda';

const channelParameter = (
  flatClient: any,
) => {
  const RET_VAL = {
    uri: flatClient?.url,
    skill: flatClient?.skill,
    environment: flatClient?.environment,
    service: flatClient?.service,
    action: flatClient?.disconnectAction,
  };
  return RET_VAL;
}

const channelParameters = (
  flatChannels: any,
) => {
  const RET_VAL = [];
  if (
    !ramda.isNil(flatChannels)
  ) {
    for (const FLAT_CHANNEL of flatChannels) {
      if (
        !ramda.isNil(FLAT_CHANNEL)
      ) {
        RET_VAL.push(channelParameter(FLAT_CHANNEL));
      }
    }
  }
  return RET_VAL;
}

const transformRawConfiguration = async (rawConfiguration, provider) => {
  const CLIENTS_FLAT = provider.getKeys(
    'AIAP_CHAT_CHANNEL_GENESYS_COH_PROVIDER',
    [
      'SKILL',
      'ENVIRONMENT',
      'SERVICE',
      'URL',
      'DISCONNECT_ACTION',
    ]
  );
  const PARAMS = channelParameters(CLIENTS_FLAT);
  const RET_VAL = provider.isEnabled('AIAP_CHAT_CHANNEL_GENESYS_COH_PROVIDER_ENABLED', false, {
    version: rawConfiguration.AIAP_CHAT_CHANNEL_GENESYS_COH_VERSION,
    channelId: rawConfiguration.AIAP_CHAT_CHANNEL_GENESYS_COH_ID,
    channelParams: PARAMS
  });

  return RET_VAL;
}

export {
  transformRawConfiguration,
}
