/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-redis-client-provider-types-client-construct-options-redis';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import {
  formatIntoAcaError,
} from '@ibm-aca/aca-utils-errors';

import {
  IRedisClientConfigurationV1,
} from '..';

import {
  constructOptionsRedisTls,
} from './construct-options-redis-tls';

import {
  constructOptionsRedisSentinels,
} from './construct-options-redis-sentinels';

const constructOptionsRedis = (
  configuration: IRedisClientConfigurationV1,
) => {
  try {
    const NAME = configuration?.name;
    const URL = configuration?.url;
    const PASSWORD = configuration?.password;
    const ADAPTER_KEY_PREFIX = configuration?.keyPrefix || 'default:';

    const TLS_OPTIONS = constructOptionsRedisTls(configuration);
    const SENTINELS = constructOptionsRedisSentinels(configuration);

    const RET_VAL = {
      name: NAME,
      url: URL,
      password: PASSWORD,
      keyPrefix: ADAPTER_KEY_PREFIX,
      sentinels: SENTINELS,
      tls: TLS_OPTIONS,
    };
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(constructOptionsRedis.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

export {
  constructOptionsRedis,
}
