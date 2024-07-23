/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-redis-client-provider-types-client-construct-options-redis-sentinels';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import {
  IRedisClientConfigurationV1,
} from '..';

const constructOptionsRedisSentinels = (
  configuration: IRedisClientConfigurationV1,
) => {
  let retVal;
  const REDIS_SENTINELS = configuration?.sentinels;
  if (
    REDIS_SENTINELS
  ) {
    retVal = REDIS_SENTINELS;
  }
  return retVal;
}

export {
  constructOptionsRedisSentinels,
}
