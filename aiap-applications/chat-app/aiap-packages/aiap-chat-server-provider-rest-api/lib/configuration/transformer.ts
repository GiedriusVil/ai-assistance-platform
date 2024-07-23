/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/

import lodash from '@ibm-aca/aca-wrapper-lodash';
import ramda from '@ibm-aca/aca-wrapper-ramda';

const server = (flatServer) => {
  const RET_VAL = {
      tenant: {
          id: flatServer?.tenantId,
      },
      engagement: {
          id: flatServer?.engagementId,
      },
      assistant: {
          id: flatServer?.assistantId,
      }
  }
  return RET_VAL;
}

const servers = (flatServers) => {
  const RET_VAL = [];
  if (
      !lodash.isEmpty(flatServers)
  ) {
      for (let flatServer of flatServers) {
          if (
              !lodash.isEmpty(flatServer)
          ) {
              RET_VAL.push(server(flatServer));
          }
      }
  }
  return RET_VAL;
}

const transformRawConfiguration = async (rawConfiguration, provider) => {
  const SERVERS_FLAT = provider.getKeys(
    'CHAT_REST_SERVER_PROVIDER',
    [
        'TENANT_ID',
        'ENGAGEMENT_ID',
        'ASSISTANT_ID'
    ]
);
const SERVERS = servers(SERVERS_FLAT);
  const RET_VAL = provider.isEnabled('CHAT_REST_SERVER_PROVIDER_ENABLED', true, {
    servers: SERVERS
  });
  return RET_VAL;
}

export {
  transformRawConfiguration,
}
