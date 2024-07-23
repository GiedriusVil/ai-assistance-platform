/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-socket-io-provider';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const lodash = require('lodash');
const ramda = require('ramda');

const {
  getRedisClient,
} = require('@ibm-aiap/aiap-redis-client-provider');

const {
  setConfigurationProvider,
  getConfiguration,
  Configurator
} = require('./lib/configuration');
const { throwAcaError, ACA_ERROR_TYPE } = require('@ibm-aca/aca-utils-errors');

const SOCKET_IO_PROVIDERS = {};

const SOCKET_IO_PROVIDER_TYPES = {
  REDIS: 'redis'
}

const initAcaSocketIOConfig = (config) => {
  const SOCKET_IO_PROVIDER_NAME = ramda.path(['name'], config);
  const SOCKET_IO_PROVIDER_TYPE = ramda.path(['type'], config);
  let socketIORedisAdapter;

  const MESSAGE_UNKNOWN_SOCKET_IO_ADAPTER_TYPE = `Unknown socket IO Redis Adapter type [${SOCKET_IO_PROVIDER_TYPE}]!`;

  switch (SOCKET_IO_PROVIDER_TYPE) {
    case SOCKET_IO_PROVIDER_TYPES.REDIS:
      socketIORedisAdapter = socketIORedisAdapterConstructor(config);
      break;
    default:
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.INITIALIZATION_ERROR, MESSAGE_UNKNOWN_SOCKET_IO_ADAPTER_TYPE);
      break;
  }
  SOCKET_IO_PROVIDERS[SOCKET_IO_PROVIDER_NAME] = socketIORedisAdapter;
}

const socketIORedisAdapterConstructor = (CONFIG) => {
  const EMITTER = getRedisClient(CONFIG.emitter);
  const RECEIVER = getRedisClient(CONFIG.receiver);
  const redisAdapter = require('@socket.io/redis-adapter');
  let retVal;
  retVal = redisAdapter.createAdapter(EMITTER.client, RECEIVER.client);
  return retVal;
}


const initSocketIOProvider = () => {
  const CONFIGURATION = ramda.path([Configurator.NAME], getConfiguration());
  if (
    lodash.isObject(CONFIGURATION) &&
    !lodash.isEmpty(CONFIGURATION)
  ) {
    const SOCKET_IO_PROVIDER_CONFIG = ramda.path(['SOCKET_IO_PROVIDERS'], CONFIGURATION);
    if (
      !lodash.isEmpty(SOCKET_IO_PROVIDER_CONFIG) &&
      lodash.isArray(SOCKET_IO_PROVIDER_CONFIG)
    ) {
      for (let socketIOConfig of SOCKET_IO_PROVIDER_CONFIG) {
        initAcaSocketIOConfig(socketIOConfig);
      }
    } else {
      logger.warn('zero socket IO providers are configured!');
    }
  } else if (
    lodash.isBoolean(CONFIGURATION) &&
    !CONFIGURATION
  ) {
    logger.warn('Socket IO explicitly turned off by configuration!');
  } else {
    const ACA_ERROR = {
      type: 'VALIDATION_ERROR',
      message: `[${MODULE_ID}] Missing required socket IO configuration`,
    }
    throw ACA_ERROR;
  }
};


const initByConfigurationProvider = async (provider) => {
  if (
    lodash.isEmpty(provider)
  ) {
    const ACA_ERROR = {
      type: 'VALIDATION_ERROR',
      message: `[${MODULE_ID}] Misssing required provider parameter!`
    }
    throw ACA_ERROR;
  }
  setConfigurationProvider(provider);
  initSocketIOProvider();
}

const getSocketIORedisAdapter = (name = 'default') => {
  const RET_VAL = SOCKET_IO_PROVIDERS[name];
  return RET_VAL;
};

module.exports = {
  initByConfigurationProvider,
  getSocketIORedisAdapter
}
