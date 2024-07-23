/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const transformAppConfiguration = async (rawConfiguration) => {
  const RET_VAL = {
    wdsManagerUrl: rawConfiguration.WDS_MANAGER_URL,
    port: rawConfiguration.PORT || 3004,
    options: {
      widgetEnabled: rawConfiguration.CHAT_WIDGET_ENABLED || 'true',
    },
  };
  return RET_VAL;
}

export {
  transformAppConfiguration
}
