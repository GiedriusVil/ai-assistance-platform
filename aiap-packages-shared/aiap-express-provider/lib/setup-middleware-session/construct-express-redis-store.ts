/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'express-provider-setup-middleware-session-construct-express-redis-store';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const connectRedis = require('connect-redis');

import lodash from '@ibm-aca/aca-wrapper-lodash';

import {
  ACA_ERROR_TYPE,
  formatIntoAcaError,
  throwAcaError,
} from '@ibm-aca/aca-utils-errors';

import {
  getRedisClient,
} from '@ibm-aiap/aiap-redis-client-provider';

export const constructExpressRedisStore = (
  expressSession: any,
  redisClientName: string,
) => {
  try {
    const ACA_REDIS_CLIENT = getRedisClient(redisClientName);
    if (
      lodash.isEmpty(ACA_REDIS_CLIENT)
    ) {
      const ERROR_MESSAGE = 'Missing RedisClient!';
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, ERROR_MESSAGE);
    }
    if (
      lodash.isEmpty(ACA_REDIS_CLIENT.client)
    ) {
      const ERROR_MESSAGE = 'Missing RedisClient.client!';
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, ERROR_MESSAGE);
    }
    const EXPRESS_REDIS_STORE = connectRedis(expressSession);
    const EXPRESS_REDIS_STORE_OPTIONS = {
      client: ACA_REDIS_CLIENT.client,
    };
    const RET_VAL = new EXPRESS_REDIS_STORE(EXPRESS_REDIS_STORE_OPTIONS);
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(constructExpressRedisStore.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}
