/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const {
  getSecretProvider,
} = require('../utils');

const transformAppConfiguration = async (rawConfiguration) => {
  const secretProvider = await getSecretProvider(rawConfiguration);
  const RET_VAL = {
    wdsManagerUrl: rawConfiguration.WDS_MANAGER_URL,
    port: rawConfiguration.PORT || {{serverPort}},
    options: {
      widgetEnabled: rawConfiguration.CHAT_WIDGET_ENABLED || 'true',
    },
  };
  return RET_VAL;
}

module.exports = {
  transformAppConfiguration
}
