/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
export const transformRawConfiguration = async (
  rawConfiguration: any,
  provider: any,
) => {
  const RET_VAL = {
    configurationLocalSyncEnabled: provider.isEnabled('AIAP_APP_SERVICE_CONFIGURATION_LOCAL_SYNC_ENABLED', false),
    externalAccessGroupsSyncEnabled: provider.isEnabled('AIAP_APP_SERVICE_EXTERNAL_ACCESS_GROUPS_SYNC_ENABLED', false),
    default: {
      accessGroups: provider.isEnabled('AIAP_APP_SERVICE_DEFAULT_ACCESS_GROUPS_ENABLED', false),
    }
  };
  return RET_VAL;
}
