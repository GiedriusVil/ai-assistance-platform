/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-mongo-client-provider-client-factory';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import lodash from '@ibm-aca/aca-wrapper-lodash';

import {
  ACA_ERROR_TYPE,
  formatIntoAcaError,
  throwAcaError,
} from '@ibm-aca/aca-utils-errors';

import {
  AiapMongoClientV1,
} from '../client';

const createOneAiapMongoClientV1 = async (
  configuration: any
) => {
  try {
    if (
      lodash.isEmpty(configuration)
    ) {
      const MESSAGE = 'Missing required configuration parameter!';
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, MESSAGE, { configuration });
    }
    const RET_VAL = new AiapMongoClientV1(configuration);
    await RET_VAL.initialize();
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(createOneAiapMongoClientV1.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

const createManyAiapMongoClientV1 = async (
  configurations: any
) => {
  try {
    if (
      !lodash.isArray(configurations)
    ) {
      const MESSAGE = 'Wrong type of provided parameter configurations! [Expected: Array]';
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, MESSAGE, { configurations });
    }
    const PROMISES = configurations.map((configuration) => {
      return createOneAiapMongoClientV1(configuration);
    });
    const RET_VAL = await Promise.all(PROMISES);
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(MODULE_ID, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

const mongoClientFactory = {
  createOneAiapMongoClientV1,
  createManyAiapMongoClientV1,
};

export {
  mongoClientFactory
}
