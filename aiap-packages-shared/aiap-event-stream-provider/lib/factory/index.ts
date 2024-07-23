/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-event-stream-provider-factory';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import lodash from '@ibm-aca/aca-wrapper-lodash';

import {
  ACA_ERROR_TYPE,
  throwAcaError,
  formatIntoAcaError,
} from '@ibm-aca/aca-utils-errors';

import {
  EventStreamRedisV1,
} from '../event-stream-redis';


const EVENT_STREAM_TYPE = {
  REDIS: 'redis',
}

const createEventStreamRedis = async (
  configuration: any,
) => {
  try {
    if (
      lodash.isEmpty(configuration)
    ) {
      const MESSAGE = 'Missing configuration required parameter! [EMPTY, NULL, UNDEFINED]';
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, MESSAGE, { configuration });
    }
    const RET_VAL = new EventStreamRedisV1(configuration);
    await RET_VAL.initialize();
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(createEventStreamRedis.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

const createEventStreams = async (
  configurations: Array<any>,
) => {
  try {
    if (
      !lodash.isArray(configurations)
    ) {
      const MESSAGE = 'Wrong type of provided parameter configurations! [Expected: Array]';
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, MESSAGE, { configurations });
    }
    const PROMISES_REDIS = [];

    for (const CONFIGURATION of configurations) {
      const TYPE = CONFIGURATION?.type;

      const MESSAGE_UNSUPPORTED_TYPE = `Unsupported redis client type! [Actual: ${TYPE}]`;
      switch (TYPE) {
        case EVENT_STREAM_TYPE.REDIS:
          PROMISES_REDIS.push(createEventStreamRedis(CONFIGURATION));
          break;
        default:
          throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, MESSAGE_UNSUPPORTED_TYPE);
          break;
      }
    }

    const RET_VAL = await Promise.all(PROMISES_REDIS);
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(createEventStreams.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

export {
  createEventStreams,
}
