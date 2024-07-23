/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import lodash from '@ibm-aca/aca-wrapper-lodash';

const _ioSessionProviderClientConfiguration = (rawConfiguration, provider) => {
  const RET_VAL = {
    reconnectionAttempts: rawConfiguration.CHAT_SERVER_IO_SESSION_PROVIDER_CLIENT_RECONNECT_ATTEMPTS || 5,
    withCredentials: provider.isTrue(rawConfiguration.CHAT_SERVER_IO_SESSION_PROVIDER_CLIENT_WITH_CREDENTIALS)
  };
  return RET_VAL;
}

const _ioSessionProviderServerCorsOrigin = (rawConfiguration, provider) => {
  const RET_VAL: any = {};
  const CORS_ORIGIN = provider.getKeys(
    'CHAT_SERVER_IO_SESSION_PROVIDER_SERVER_CORS',
    [
      'ORIGIN'
    ]
  );
  RET_VAL.origin = CORS_ORIGIN;
  return RET_VAL;
}

const _ioSessionProviderServerCorsConfiguration = (rawConfiguration, provider) => {
  const CORS_ORIGIN = _ioSessionProviderServerCorsOrigin(rawConfiguration, provider);
  const CORS_METHODS = rawConfiguration.CHAT_SERVER_IO_SESSION_PROVIDER_SERVER_CORS_METHODS;
  const CORS_CREDENTIALS = rawConfiguration.CHAT_SERVER_IO_SESSION_PROVIDER_SERVER_CORS_CREDENTIALS;
  const RET_VAL: any = {};
  if (
    !lodash.isEmpty(CORS_ORIGIN)
  ) {
    const ORIGIN = [];
    CORS_ORIGIN.origin.map(origin => {
      ORIGIN.push(origin.origin);
    })
    RET_VAL.origin = ORIGIN;
  }
  if (
    RET_VAL.origin?.length === 1 && RET_VAL.origin[0] === '*'
  ) {
    RET_VAL.origin = RET_VAL.origin[0];
  }
  if (
    lodash.isString(CORS_METHODS) && !lodash.isEmpty(CORS_METHODS)
  ) {
    RET_VAL.methods = rawConfiguration.CHAT_SERVER_IO_SESSION_PROVIDER_SERVER_CORS_METHODS.split(',');
  }
  if (
    provider.isTrue(CORS_CREDENTIALS)
  ) {
    RET_VAL.credentials = true;
  }
  return RET_VAL;
}

const _ioSessionProviderServerConfiguration = (rawConfiguration, provider) => {
  const RET_VAL: any = {
    allowUpgrades: rawConfiguration.CHAT_SERVER_IO_SESSION_PROVIDER_SERVER_ALLOW_UPGRADES || true,
    pingTimeout: rawConfiguration.CHAT_SERVER_IO_SESSION_PROVIDER_SERVER_PING_INTERVAL || 20000,
    pingInterval: rawConfiguration.CHAT_SERVER_IO_SESSION_PROVIDER_SERVER_PING_TIMEOUT || 25000,
  };
  if (
    !lodash.isEmpty(rawConfiguration?.CHAT_SERVER_IO_SESSION_PROVIDER_SERVER_PATH)
  ) {
    RET_VAL.path = rawConfiguration?.CHAT_SERVER_IO_SESSION_PROVIDER_SERVER_PATH;
  }

  if (
    !lodash.isEmpty(rawConfiguration?.CHAT_SERVER_IO_SESSION_PROVIDER_SERVER_TRANSPORTS) &&
    lodash.isString(rawConfiguration?.CHAT_SERVER_IO_SESSION_PROVIDER_SERVER_TRANSPORTS)
  ) {
    RET_VAL.transports = rawConfiguration.CHAT_SERVER_IO_SESSION_PROVIDER_SERVER_TRANSPORTS.split(',')
  }

  if (provider.isTrue(rawConfiguration.CHAT_SERVER_IO_SESSION_PROVIDER_SERVER_ENABLED)) {
    // RET_VAL.cookie --> TO_BE DONE
  }
  if (provider.isTrue(rawConfiguration.CHAT_SERVER_IO_SESSION_PROVIDER_SERVER_CORS_ENABLED)) {
    RET_VAL.cors = _ioSessionProviderServerCorsConfiguration(rawConfiguration, provider);
  }
  return RET_VAL;
}

const _ioSesionProviderConfiguration = (rawConfiguration, provider) => {
  const RET_VAL = provider.isEnabled(
    'CHAT_SERVER_IO_SESSION_PROVIDER_ENABLED',
    false,
    {
      server: _ioSessionProviderServerConfiguration(rawConfiguration, provider),
      client: _ioSessionProviderClientConfiguration(rawConfiguration, provider),
    });
  return RET_VAL;
}




const _sessionExpirationNotifier = (rawConfiguration, provider) => {
  const RET_VAL = provider.isEnabled(
    'CHAT_SERVER_SESSION_EXPIRATION_NOTIFIER_ENABLED',
    false,
    {
      thresholdInSeconds: +rawConfiguration.CHAT_SERVER_SESSION_EXPIRATION_NOTIFIER_THRESHOLD_IN_SECONDS,
      waitInMs: +rawConfiguration.CHAT_SERVER_SESSION_EXPIRATION_NOTIFIER_WAIT_IN_MS,
      lock: {
        resource: rawConfiguration.CHAT_SERVER_SESSION_EXPIRATION_NOTIFIER_LOCK_RESOURCE,
        lengthInMS: +rawConfiguration.CHAT_SERVER_SESSION_EXPIRATION_NOTIFIER_LOCK_LENGTH_IN_MS,
      },
      redlock: {
        driftFactor: +rawConfiguration.CHAT_SERVER_SESSION_EXPIRATION_NOTIFIER_REDLOCK_DRIFT_FACTOR,
        retryCount: +rawConfiguration.CHAT_SERVER_SESSION_EXPIRATION_NOTIFIER_REDLOCK_RETRY_COUNT,
        retryDelayInMs: +rawConfiguration.CHAT_SERVER_SESSION_EXPIRATION_NOTIFIER_REDLOCK_RETRY_DELAY_IN_MS,
        retryJitterInMs: +rawConfiguration.CHAT_SERVER_SESSION_EXPIRATION_NOTIFIER_REDLOCK_RETRY_JITTER_IN_MS,
        automaticExtensionThresholdInMs: +rawConfiguration.CHAT_SERVER_SESSION_EXPIRATION_NOTIFIER_REDLOCK_AUTOMATIC_EXTENSION_THRESHOLD_IN_MS,
      }
    });

  console.log(_sessionExpirationNotifier.name, {
    RET_VAL
  });
  return RET_VAL;
}

const transformRawConfiguration = async (rawConfiguration, provider) => {
  const RET_VAL = provider.isEnabled('CHAT_SERVER_ENABLED', false, {
    ioSessionProvider: _ioSesionProviderConfiguration(rawConfiguration, provider),
    sessionExpirationNotifier: _sessionExpirationNotifier(rawConfiguration, provider),
  });
  return RET_VAL;
}

export {
  transformRawConfiguration,
}
