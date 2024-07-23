/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import lodash from '@ibm-aca/aca-wrapper-lodash';

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

const redisTls = (
  flatClient: {
    tlsEnabled: any,
    tlsServerName: any,
    redisTlsStrictSsl: any,
    tlsPfxPfx: any,
    tlsPfxPassphrase: any,
    tlsCertCert: any,
    tlsCertKey: any,
    tlsCertPassphrase: any,
    tlsCertCertCa: any,
  },
) => {
  let retVal;
  if (
    isTrue(flatClient.tlsEnabled)
  ) {
    retVal = {
      serverName: flatClient.tlsServerName,
      strictSSL: isTrue(flatClient.redisTlsStrictSsl),
      pfx: {
        pfx: flatClient.tlsPfxPfx,
        passphrase: flatClient.tlsPfxPassphrase,
      },
      cert: {
        cert: flatClient.tlsCertCert,
        key: flatClient.tlsCertKey,
        passphrase: flatClient.tlsCertPassphrase,
        ca: flatClient.tlsCertCertCa,
      },
    }
  }
  return retVal;
}

const redis = (
  flatClient: {
    type?: string,
    url?: string,
    name?: string,
    password?: string,
    keyPrefix?: string,
    tlsEnabled: any,
    tlsServerName: any,
    redisTlsStrictSsl: any,
    tlsPfxPfx: any,
    tlsPfxPassphrase: any,
    tlsCertCert: any,
    tlsCertKey: any,
    tlsCertPassphrase: any,
    tlsCertCertCa: any,
  },
) => {
  const RET_VAL: any = {
    type: flatClient.type,
    url: flatClient.url,
    name: flatClient.name,
    password: flatClient.password,
    keyPrefix: flatClient.keyPrefix,
    sentinels: false, // return later
    encryption: false,
    cluster: false
  }
  const REDIS_TLS = redisTls(flatClient);
  if (
    REDIS_TLS
  ) {
    RET_VAL.tls = REDIS_TLS;
  }
  return RET_VAL;
}

const client = (
  flatClient: any,
) => {
  let retVal;
  if (
    !lodash.isEmpty(flatClient)
  ) {
    retVal = redis(flatClient);
  }
  return retVal;
}

const redisClients = (
  flatClients: Array<any>,
) => {
  const RET_VAL = [];
  if (
    !lodash.isEmpty(flatClients) &&
    lodash.isArray(flatClients)
  ) {
    for (const FLAT_CLIENT of flatClients) {
      const TMP_FLAT_CLIENT = client(FLAT_CLIENT)
      if (
        !lodash.isEmpty(TMP_FLAT_CLIENT)
      ) {
        RET_VAL.push(TMP_FLAT_CLIENT);
      }
    }
  }
  return RET_VAL;
}

const transformRawConfiguration = async (
  rawConfiguration: any,
  provider: any,
) => {
  const CLIENTS_FLAT = provider.getKeys(
    'REDIS_CLIENT_PROVIDER',
    [
      'NAME',
      'TYPE',
      'KEY_PREFIX',
      'EXPIRATION',
      'URL',
      'NAME',
      'PASSWORD',
      'TLS_ENABLED',
      'TLS_SERVER_NAME',
      'TLS_STRINCT_SSL',
      'TLS_PFX_PFX',
      'TLS_PFX_PASSPHRASE',
      'TLS_CERT_CERT',
      'TLS_CERT_KEY',
      'TLS_CERT_PASSPHRASE',
      'TLS_CERT_CERT_CA',
      'ENCRYPTION_ENABLED',
      'ENCRYPTION_KEY',
      'ENCRYPTION_HMAC_KEY'
    ]
  );
  const CLIENTS = redisClients(CLIENTS_FLAT);
  const RET_VAL = provider.isEnabled('REDIS_CLIENT_PROVIDER_ENABLED', false, {
    clients: CLIENTS
  });
  return RET_VAL;
}

export {
  transformRawConfiguration,
}
