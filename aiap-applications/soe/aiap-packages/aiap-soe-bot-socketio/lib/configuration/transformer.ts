/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import lodash from '@ibm-aca/aca-wrapper-lodash';

const _socketIoServerOptions = (
  rawConfiguration,
  provider,
) => {
  const RET_VAL: any = {};

  RET_VAL.cookie = rawConfiguration.AIAP_BOT_SOCKETIO_SOCKET_IO_SERVER_OPTIONS_COOKIE || false;
  RET_VAL.path = rawConfiguration.AIAP_BOT_SOCKETIO_SOCKET_IO_SERVER_OPTIONS_PATH || '/aca';

  if (
    !lodash.isEmpty(rawConfiguration.AIAP_BOT_SOCKETIO_SOCKET_IO_SERVER_OPTIONS_TRANSPORTS)
  ) {
    RET_VAL.transports = JSON.parse(rawConfiguration.AIAP_BOT_SOCKETIO_SOCKET_IO_SERVER_OPTIONS_TRANSPORTS);
  }

  RET_VAL.allowUpgrades = rawConfiguration.AIAP_BOT_SOCKETIO_SOCKET_IO_SERVER_OPTIONS_ALLOW_UPGRADES || true;
  RET_VAL.pingTimeout = rawConfiguration.AIAP_BOT_SOCKETIO_SOCKET_IO_SERVER_OPTIONS_ALLOW_PING_INTERVAL || 20000;
  RET_VAL.pingInterval = rawConfiguration.AIAP_BOT_SOCKETIO_SOCKET_IO_SERVER_OPTIONS_ALLOW_PING_TIMEOUT || 25000;

  return RET_VAL;
}

const _settings = (
  rawConfiguration,
  provider,
) => {
  const RET_VAL = {
    id: rawConfiguration.AIAP_BOT_SOCKETIO_SETTINGS_ID,
    agent: rawConfiguration.AIAP_BOT_SOCKETIO_SETTINGS_AGENT,
    requireRole: rawConfiguration.AIAP_BOT_SOCKETIO_SETTINGS_REQUIRE_ROLE,
    path: rawConfiguration.AIAP_BOT_SOCKETIO_SETTINGS_PATH,
    authProvider: {
      host: rawConfiguration.AIAP_BOT_SOCKETIO_SETTINGS_AUTH_PROVIDER_HOST,
    },
    session: {
      expiration: rawConfiguration.AIAP_BOT_SOCKETIO_SETTINGS_SESSION_EXPIRATION, // TODO validate value used
    },
    typingOffDelay: rawConfiguration.AIAP_BOT_SOCKETIO_SETTINGS_PATH_TYPING_OFF_DELAY,
    activity: {
      close: provider.isEnabled('AIAP_BOT_SOCKETIO_SETTINGS_ACTIVITY_CLOSE_ENABLED', false, {
        inactivityTime: rawConfiguration.AIAP_BOT_SOCKETIO_SETTINGS_ACTIVITY_CLOSE_INACTIVITY_TIME,
        closingStateTime: rawConfiguration.AIAP_BOT_SOCKETIO_SETTINGS_ACTIVITY_CLOSE_ACTIVITY_CLOSE_CLOSING_STATE_TIME,
      }),
      message: provider.isEnabled('AIAP_BOT_SOCKETIO_SETTINGS_ACTIVITY_MESSAGE_ENABLED', false, {
        inactivityTime: rawConfiguration.AIAP_BOT_SOCKETIO_SETTINGS_ACTIVITY_MESSAGE_INACTIVITY_TIME,
        message: rawConfiguration.AIAP_BOT_SOCKETIO_SETTINGS_ACTIVITY_MESSAGE_MESSAGE,
      }),
    },
  };
  return RET_VAL;
}

const transformRawConfiguration = async (
  rawConfiguration,
  provider,
) => {
  const RET_VAL = provider.isEnabled(
    'AIAP_BOT_SOCKETIO_ENABLED',
    false,
    {
      settings: _settings(rawConfiguration, provider),
      socketIoServerOptions: _socketIoServerOptions(rawConfiguration, provider),
    });
  return RET_VAL;
}

export {
  transformRawConfiguration,
}
