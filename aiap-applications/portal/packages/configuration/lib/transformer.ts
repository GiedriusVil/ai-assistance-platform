/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import configurationProvider from '@ibm-aiap/aiap-env-configuration-service';

import { transformAppConfiguration } from './application/transformer';
import { loadExternalLibsConfiguration } from './external-configurations';

const transformRawConfiguration = async (rawConfiguration: any) => {
  const RET_VAL = {
    logger: {
      debug: rawConfiguration.DEBUG,
      enablePrettifier: rawConfiguration.LOGGER_ENABLE_PRETTIFIER || false
    },
    app: await transformAppConfiguration(rawConfiguration),
    cos: {
      endpoint: rawConfiguration.COS_ENDPOINT,
      apiKey: rawConfiguration.COS_API_KEY,
    },
  };
  await loadExternalLibsConfiguration(RET_VAL, rawConfiguration, configurationProvider);
  return RET_VAL;
}

export {
  transformRawConfiguration,
}
