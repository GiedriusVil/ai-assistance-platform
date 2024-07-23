/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const transformAppConfiguration = async (rawConfiguration) => {
  const RET_VAL = {
    wdsManagerUrl: rawConfiguration.WDS_MANAGER_URL,
    jobsQueuesFrontEndpoint: rawConfiguration.JOBS_QUEUES_FRONT_ENDPOINT,
    port: rawConfiguration.PORT || 3010,
    options: {
      widgetEnabled: rawConfiguration.CHAT_WIDGET_ENABLED || 'true',
    },
  };
  return RET_VAL;
}

export {
  transformAppConfiguration
}
