/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-bot-socketio-configuration-transformer';

const _settings = (rawConfiguration, provider) => {
  const RET_VAL = {
    id: rawConfiguration.AIAP_BOT_REST_API_SETTINGS_ID,
  };
  return RET_VAL;
}

const transformRawConfiguration = async (rawConfiguration, provider) => {
  const RET_VAL = provider.isEnabled('AIAP_BOT_REST_API_ENABLED', false, {
    settings: _settings(rawConfiguration, provider),
  });
  return RET_VAL;
}

export {
  transformRawConfiguration,
}
