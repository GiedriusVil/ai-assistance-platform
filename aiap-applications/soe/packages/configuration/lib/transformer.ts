/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/

import configurationProvider from '@ibm-aiap/aiap-env-configuration-service';

import { loadExternalLibsConfiguration } from './external-configurations';

const transformRawConfiguration = async (rawConfiguration: any) => {
  const RET_VAL = {
    logger: {
      debug: rawConfiguration.DEBUG,
      enablePrettifier: rawConfiguration.LOGGER_ENABLE_PRETTIFIER || false,
    }
  };
  await loadExternalLibsConfiguration(RET_VAL, rawConfiguration, configurationProvider);

  return RET_VAL;
};

export {
  transformRawConfiguration,
}
