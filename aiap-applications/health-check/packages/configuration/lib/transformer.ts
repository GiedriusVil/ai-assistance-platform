/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const configurationProvider = require('@ibm-aiap/aiap-env-configuration-service');

import { transformAppConfiguration } from './application/transformer';
import { loadExternalLibsConfiguration } from './external-configurations';

const transformRawConfiguration = async (rawConfiguration) => {
  const RET_VAL = {
    logger: {
      debug: rawConfiguration.DEBUG,
      enablePrettifier: rawConfiguration.LOGGER_ENABLE_PRETTIFIER || false
    },
    app: await transformAppConfiguration(rawConfiguration),
  };
  await loadExternalLibsConfiguration(RET_VAL, rawConfiguration, configurationProvider);
  return RET_VAL;
}

export {
  transformRawConfiguration
}
