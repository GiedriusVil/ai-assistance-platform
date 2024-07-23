/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import lodash from '@ibm-aca/aca-wrapper-lodash';
import ramda from '@ibm-aca/aca-wrapper-ramda';

const mongoClients = (
  flatClients: any
) => {
  const RET_VAL = [];
  if (
    !ramda.isNil(flatClients)
  ) {
    for (const FLAT_CLIENT of flatClients) {
      if (
        !ramda.isNil(FLAT_CLIENT)
      ) {
        RET_VAL.push(mongoClient(FLAT_CLIENT));
      }
    }
  }
  return RET_VAL;
}

const isTrue = (
  value: any,
) => {
  let retVal = false;
  if (
    lodash.isString(value) &&
    value === 'true'
  ) {
    retVal = true;
  } else if (
    lodash.isBoolean(value) &&
    value
  ) {
    retVal = true;
  }
  return retVal;
};

const mongoClient = (
  flatClient: any
) => {
  let ssl: any = false;
  const SSL_ENABLED = ramda.pathOr(false, ['clientSslEnabled'], flatClient);
  if (
    isTrue(SSL_ENABLED)
  ) {
    ssl = {
      cert: flatClient?.clientSslCertBase64,
    }
  }
  const RET_VAL: any = {
    name: flatClient?.clientName,
    options: {
      uri: flatClient?.clientUrl,
      name: flatClient?.clientDbName,
      ssl: ssl,
    }
  }
  if (
    !lodash.isEmpty(flatClient?.clientSslValidate)
  ) {
    RET_VAL.options.sslValidate = flatClient.clientSslValidate;
  }
  if (
    !lodash.isEmpty(flatClient?.clientProxyHost)
  ) {
    RET_VAL.options.proxyHost = flatClient.clientProxyHost;
  }
  if (
    !lodash.isEmpty(flatClient?.clientProxyPort)
  ) {
    RET_VAL.options.proxyPort = parseInt(flatClient.clientProxyPort);
  }
  
  RET_VAL.options.onlineEventTimeout = parseInt(flatClient.clientOnlineEventTimeout) || 30 * 1000;

  return RET_VAL;
}

const transformRawConfiguration = async (rawConfiguration, provider) => {
  const CLIENTS_FLAT = provider.getKeys(
    'MONGO_CLIENTS_PROVIDER',
    [
      'CLIENT_NAME',
      'CLIENT_URL',
      'CLIENT_DB_NAME',
      'CLIENT_SSL_ENABLED',
      'CLIENT_SSL_CERT_BASE64',
      'CLIENT_SSL_VALIDATE',
      'CLIENT_PROXY_HOST',
      'CLIENT_PROXY_PORT',
      'CLIENT_ONLINE_EVENT_TIMEOUT'
    ]
  );
  const MONGO_CLIENTS = mongoClients(CLIENTS_FLAT);

  const RET_VAL = provider.isEnabled('MONGO_CLIENTS_PROVIDER_ENABLED', false, {
    methodParamsLoggerEnabled: provider.isEnabled('MONGO_CLIENTS_PROVIDER_METHOD_PARAMS_LOGGER_ENABLED'),
    clients: MONGO_CLIENTS
  });
  return RET_VAL;
}

export {
  transformRawConfiguration,
}
