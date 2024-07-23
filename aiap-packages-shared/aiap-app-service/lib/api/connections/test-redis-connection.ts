/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'app-service-connections-test-redis-connection';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import lodash from '@ibm-aca/aca-wrapper-lodash';

import {
  formatIntoAcaError,
  ACA_ERROR_TYPE,
  throwAcaError,
} from '@ibm-aca/aca-utils-errors';

import {
  redisClientFactory,
} from '@ibm-aiap/aiap-redis-client-provider';

export const testRedisConnection = async (
  params: {
    configuration: any,
  },
) => {
  const CONFIGURATION = params?.configuration;
  try {
    if (
      lodash.isEmpty(CONFIGURATION)
    ) {
      const MESSAGE = 'Missing required params.configuration parameter!';
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }
    const ACA_REDIS_CLIENT = await redisClientFactory.createRedisClient(CONFIGURATION);
    const RET_VAL = await ACA_REDIS_CLIENT.testConnection();
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(testRedisConnection.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

