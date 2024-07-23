/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const ramda = require('@ibm-aca/aca-wrapper-ramda');
const lodash = require('@ibm-aca/aca-wrapper-lodash');

const transformRawConfiguration = async (rawConfiguration, provider) => {
  const RET_VAL = provider.isEnabled('AIAP_ANSWERS_SERVICE_ENABLED', false, {
    configurationLocalSyncEnabled: provider.isEnabled('AIAP_ANSWERS_SERVICE_CONFIGURATION_LOCAL_SYNC_ENABLED', false),
    environment: {
      lower: rawConfiguration.AIAP_ANSWERS_SERVICE_LOWER_ENVIRONMENT_DATASOURCE || 'default',
      current: rawConfiguration.AIAP_ANSWERS_SERVICE_CURRENT_ENVIRONMENT_DATASOURCE || 'default'
    }
  });
  return RET_VAL;
}

module.exports = {
  transformRawConfiguration,
}
