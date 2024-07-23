/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
// const ramda = require('ramda');

export const transformRawConfiguration = async (
  rawConfiguration: any,
  provider: any,
) => {
  const RET_VAL = {
    configurationLocalSyncEnabled: provider.isEnabled('AIAP_AI_SERVICES_SERVICE_CONFIGURATION_LOCAL_SYNC_ENABLED', false),
  };
  return RET_VAL;
}
