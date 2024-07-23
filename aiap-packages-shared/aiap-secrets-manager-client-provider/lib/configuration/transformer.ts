/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import lodash from '@ibm-aca/aca-wrapper-lodash';
import ramda from '@ibm-aca/aca-wrapper-ramda';

const clients = (flatClients) => {
  const RET_VAL = [];
  if (!ramda.isNil(flatClients)) {
    for (const FLAT_CLIENT of flatClients) {
      if (!ramda.isNil(FLAT_CLIENT)) {
        RET_VAL.push(client(FLAT_CLIENT));
      }
    }
  }
  return RET_VAL;
}

const client = (flatClient) => {
  const RET_VAL = {
    name: flatClient?.clientName,
    options: {
      url: flatClient?.clientUrl,
      version: flatClient?.clientVersion ?? 'v2',
    }
  }
  return RET_VAL;
}

const transformRawConfiguration = async (rawConfiguration, provider) => {
  const CLIENTS_FLAT = provider.getKeys(
    'SECRETS_MANAGER_CLIENTS_PROVIDER',
    [
      'CLIENT_NAME',
      'CLIENT_URL',
      'CLIENT_VERSION',
    ]
  );
  const CLIENTS = clients(CLIENTS_FLAT);

  const RET_VAL = provider.isEnabled('AIAP_SECRETS_MANAGER_CLIENTS_PROVIDER_ENABLED', false, {
    clients: CLIENTS
  });
  return RET_VAL;
}

export {
  transformRawConfiguration
}
