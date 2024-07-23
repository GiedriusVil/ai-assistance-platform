/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = `aca-mongo-client-provider-client-construct-options`;
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import lodash from '@ibm-aca/aca-wrapper-lodash';

const os = require('os');
const path = require('path');

import {
  ReadPreference,
  MongoClientOptions,
  LoggerLevel,
} from 'mongodb';

import { fsExtra } from '@ibm-aca/aca-wrapper-fs-extra';

import {
  formatIntoAcaError,
  throwAcaError,
  ACA_ERROR_TYPE,
} from '@ibm-aca/aca-utils-errors';

const _appendProcessEnvOptions = (
  target: MongoClientOptions,
) => {
  if (
    !lodash.isEmpty(process?.env?.ACA_MONGO_CLIENT_SOCKET_TIMEOUT_MS)
  ) {
    target.socketTimeoutMS = parseInt(process?.env?.ACA_MONGO_CLIENT_SOCKET_TIMEOUT_MS);
  }
  if (
    !lodash.isEmpty(process?.env?.ACA_MONGO_CLIENT_MAX_IDLE_TIME_MS)
  ) {
    target.maxIdleTimeMS = parseInt(process?.env?.ACA_MONGO_CLIENT_MAX_IDLE_TIME_MS);
  }
  if (
    !lodash.isEmpty(process?.env?.ACA_MONGO_CLIENT_MAX_POOL_SIZE)
  ) {
    target.maxPoolSize = parseInt(process?.env?.ACA_MONGO_CLIENT_MAX_POOL_SIZE);
  }
  if (
    !lodash.isEmpty(process?.env?.ACA_MONGO_CLIENT_KEEP_ALIVE_INITIAL_DELAY)
  ) {
    target.keepAliveInitialDelay = parseInt(process?.env?.ACA_MONGO_CLIENT_KEEP_ALIVE_INITIAL_DELAY);
  }
  if (
    !lodash.isEmpty(process?.env?.ACA_MONGO_CLIENT_LOG_LEVEL)
  ) {
    switch (process?.env?.ACA_MONGO_CLIENT_LOG_LEVEL) {
      case LoggerLevel.INFO:
        target.loggerLevel = LoggerLevel.INFO;
        break;
      case LoggerLevel.ERROR:
        target.loggerLevel = LoggerLevel.ERROR;
        break;
      case LoggerLevel.DEBUG:
        target.loggerLevel = LoggerLevel.DEBUG;
        break;
      case LoggerLevel.WARN:
        target.loggerLevel = LoggerLevel.WARN;
        break;
      default:
        break;
    }
  }
}

const _writeSSLCAIntoFileAndReturnFileName = (
  params: {
    id?: string,
    name?: string,
    hash?: string,
    value?: string,
  },
) => {
  const FOLDER = 'mongodb-ssl-ca';
  let dir;
  let retVal;
  try {
    dir = path.join(os.tmpdir(), FOLDER);
    fsExtra.ensureDirSync(dir);
    if (
      lodash.isEmpty(params.value)
    ) {
      const ERROR_MESSAGE = `Missing required params.value parameter!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, ERROR_MESSAGE);
    }
    if (
      lodash.isEmpty(params?.id) &&
      lodash.isEmpty(params?.name) &&
      lodash.isEmpty(params?.hash)
    ) {
      const ERROR_MESSAGE = `At least one of parameters [params.id, params.name, params.value] is required!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, ERROR_MESSAGE);
    }
    retVal = `${dir}/`;

    if (
      !lodash.isEmpty(params?.id)
    ) {
      retVal = `${retVal}${params.id}:`;
    }
    if (
      !lodash.isEmpty(params?.name)
    ) {
      retVal = `${retVal}${params.name}:`;
    }
    if (
      !lodash.isEmpty(params?.hash)
    ) {
      retVal = `${retVal}${params.hash}`;
    }
    if (
      retVal.slice(-1) === ':'
    ) {
      retVal = retVal.slice(0, -1);
    }
    if (
      fsExtra.existsSync(retVal)
    ) {
      fsExtra.removeSync(retVal);
    }
    fsExtra.writeFileSync(retVal, params.value);
    return retVal;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(_writeSSLCAIntoFileAndReturnFileName.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

const _appendSSLOptions = (
  target: MongoClientOptions,
  configuration: {
    id?: string,
    name?: string,
    hash?: string,
    options?: {
      ssl?: {
        cert: string
      }
    }
  },
) => {
  let ssl;
  let sslCert;
  let sslCertTmpFilePath;
  try {
    ssl = configuration?.options?.ssl;
    sslCert = configuration?.options?.ssl?.cert;
    if (
      !lodash.isEmpty(ssl) &&
      !lodash.isEmpty(sslCert)
    ) {
      sslCertTmpFilePath = _writeSSLCAIntoFileAndReturnFileName({
        value: Buffer.from(sslCert, 'base64').toString('ascii'),
        id: configuration?.id,
        name: configuration?.name,
        hash: configuration?.hash,
      });
      target.ssl = true;
      target.sslValidate = true;
      target.sslCA = sslCertTmpFilePath;
    }

  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(_appendSSLOptions.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

const constructOptions = (
  configuration: {
    id?: string,
    name?: string,
    hash?: string,
    options?: {
      proxyHost?: string,
      proxyPort?: number,
      sslValidate?: boolean
      ssl?: {
        cert: string
      }
    }
  },
): MongoClientOptions => {
  try {
    if (
      lodash.isEmpty(configuration)
    ) {
      const ERROR_MESSAGE = `Missing required configuration parameter!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, ERROR_MESSAGE);
    }
    const RET_VAL: MongoClientOptions = {
      ignoreUndefined: true,
      readPreference: ReadPreference.PRIMARY_PREFERRED,
      retryReads: true,
      retryWrites: true,
      writeConcern: { w: 'majority' },
      //
      keepAliveInitialDelay: 10000,
      maxPoolSize: 10000,
      compressors: ['zlib'],
      // authSource: 'admin',
      // replicaSet: 'replset',
    };
    _appendProcessEnvOptions(RET_VAL);
    _appendSSLOptions(RET_VAL, configuration);
    
    if (
      lodash.isBoolean(configuration?.options?.sslValidate)
    ) {
      RET_VAL.sslValidate = configuration?.options?.sslValidate;
    }
    if (
      !lodash.isEmpty(configuration?.options?.proxyHost)
    ) {
      RET_VAL.proxyHost = configuration?.options?.proxyHost;
    }
    if (
      lodash.isNumber(configuration?.options?.proxyPort)
    ) {
      RET_VAL.proxyPort = configuration?.options?.proxyPort;
    }

    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(constructOptions.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

export {
  constructOptions,
}
