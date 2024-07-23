/*
	© Copyright IBM Corporation 2022. All Rights Reserved 
	 
	SPDX-License-Identifier: EPL-2.0
*/
/* eslint no-unused-vars: "off" */
const transformRawConfiguration = async (rawConfiguration, provider) => {
  const RET_VAL = {
    configurationLocalSyncEnabled: provider.isEnabled('AIAP_ORGANIZATION_SERVICE_CONFIGURATION_LOCAL_SYNC_ENABLED', false),
  };
  return RET_VAL;
}

module.exports = {
    transformRawConfiguration,
}
