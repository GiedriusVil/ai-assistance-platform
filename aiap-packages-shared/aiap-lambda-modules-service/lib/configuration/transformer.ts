/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/

const transformRawConfiguration = async (rawConfiguration, provider) => {
  const RET_VAL = {
    configurationLocalSyncEnabled: provider.isEnabled('AIAP_LAMBDA_MODULES_SERVICE_CONFIGURATION_LOCAL_SYNC_ENABLED', false),
  };
  return RET_VAL;
}

export {
  transformRawConfiguration,
}
