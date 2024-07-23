/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-redis-client-provider-types-client-construct-options-redis-tls';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const tls = require('tls');

import ramda from '@ibm-aca/aca-wrapper-ramda';

import {
  formatIntoAcaError,
} from '@ibm-aca/aca-utils-errors';

import {
  IRedisClientConfigurationV1,
} from '..';

const _bufferFromBase64 = (
  string: any,
) => {
  return Buffer.from(string, 'base64');
}


const constructOptionsRedisTls = (
  configuration: IRedisClientConfigurationV1,
) => {
  const REDIS_TLS = configuration?.tls;
  const REDIS_TLS_SERVERNAME = REDIS_TLS?.servername;
  const REDIS_TLS_STRICT_SSL = REDIS_TLS?.strictSSL;
  const REDIS_TLS_PFX = REDIS_TLS?.pfx;
  const REDIS_TLS_PFX_PFX = REDIS_TLS?.pfx?.pfx;
  const REDIS_TLS_PFX_PASSPHRASE = REDIS_TLS?.pfx?.passphrase;
  const REDIS_TLS_CERT = REDIS_TLS?.cert;
  const REDIS_TLS_CERT_CERT = REDIS_TLS?.cert?.cert;
  const REDIS_TLS_CERT_KEY = REDIS_TLS?.cert?.key;
  const REDIS_TLS_CERT_PASSPHRASE = REDIS_TLS?.cert?.passphrase;
  const REDIS_TLS_CERT_CA = REDIS_TLS?.cert?.ca;

  let retVal;
  try {
    if (
      REDIS_TLS
    ) {
      retVal = ramda.mergeAll(
        [
          REDIS_TLS_SERVERNAME && !REDIS_TLS_STRICT_SSL ? {
            servername: REDIS_TLS_SERVERNAME
          } : {},
          {
            checkServerIdentity: (serverName, cert) => REDIS_TLS_STRICT_SSL && true ? tls.checkServerIdentity(serverName, cert) : undefined,
          },
          configuration.tls.pfx && !ramda.isEmpty(ramda.reject(ramda.isNil, REDIS_TLS_PFX)) ? {
            pfx: REDIS_TLS_PFX_PFX && _bufferFromBase64(REDIS_TLS_PFX_PFX),
            passphrase: REDIS_TLS_PFX_PASSPHRASE,
          } :
            REDIS_TLS_CERT && !ramda.isEmpty(ramda.reject(ramda.isNil, REDIS_TLS_CERT)) ? {
              cert: REDIS_TLS_CERT_CERT && _bufferFromBase64(REDIS_TLS_CERT_CERT),
              key: REDIS_TLS_CERT_KEY && _bufferFromBase64(REDIS_TLS_CERT_KEY),
              passphrase: REDIS_TLS_CERT_PASSPHRASE,
              ca: REDIS_TLS_CERT_CA && _bufferFromBase64(REDIS_TLS_CERT_CA),
            } :
              {},
        ]
      )
    }
    return retVal;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(constructOptionsRedisTls.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

export {
  constructOptionsRedisTls,
}
