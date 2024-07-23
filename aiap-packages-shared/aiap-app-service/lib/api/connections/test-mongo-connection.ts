/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'app-service-connections-test-mongo-connection';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import lodash from '@ibm-aca/aca-wrapper-lodash';

import {
  ACA_ERROR_TYPE,
  formatIntoAcaError,
  throwAcaError,
} from '@ibm-aca/aca-utils-errors';

import {
  mongoClientFactory,
} from '@ibm-aiap/aiap-mongo-client-provider';

export const testMongoConnection = async (
  params: {
    configuration: any,
  },
) => {
  const CONFIGURATION = params?.configuration;
  try {
    if (
      lodash.isEmpty(CONFIGURATION)
    ) {
      const ERROR_MESSAGE = 'Missing required params.configuration parameter!';
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, ERROR_MESSAGE);
    }
    const ACA_MONGO_CLIENT = await mongoClientFactory.createOneAiapMongoClientV1(CONFIGURATION);
    if (
      lodash.isEmpty(ACA_MONGO_CLIENT)
    ) {
      const ERROR_MESSAGE = 'Unable to create aca mongo client!';
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, ERROR_MESSAGE);
    }
    let retVal = false;
    const STATUS = await ACA_MONGO_CLIENT.status();

    if (
      STATUS.status === 'online'
    ) {
      retVal = true;
    }
    await ACA_MONGO_CLIENT.client.close();

    return retVal;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(testMongoConnection.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}
