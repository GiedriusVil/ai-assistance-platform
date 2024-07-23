/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-object-storage-client-provider-client-factory';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import lodash from '@ibm-aca/aca-wrapper-lodash';

import {
  ACA_ERROR_TYPE,
  throwAcaError,
  formatIntoAcaError,
} from '@ibm-aca/aca-utils-errors';

import {
  ObjectStorageClientMinioV1,
} from '../client-minio';

import {
  IObjectStorageClientConfigurationV1,
  IObjectStorageClientConfigurationMinioV1,
} from '../types';

const OBJECT_STORAGE_TYPES = {
  MINIO: 'minio',
  IBM_CLOUD_S3: 'ibm_cloud_s3'
}

const createMinioObjectStorageClient = async (
  configuration: IObjectStorageClientConfigurationV1
) => {
  try {
    if (
      lodash.isEmpty(configuration)
    ) {
      const MESSAGE = 'Missing configuration required parameter! [EMPTY, NULL, UNDEFINED]';
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, MESSAGE,
        {
          configuration
        });
    }
    const RET_VAL = new ObjectStorageClientMinioV1(configuration as IObjectStorageClientConfigurationMinioV1);
    await RET_VAL.initialize();
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(createMinioObjectStorageClient.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

const createObjectStorageClient = async (
  configuration: IObjectStorageClientConfigurationV1
) => {
  try {
    const CLIENT_TYPE = configuration?.type;
    if (
      lodash.isEmpty(CLIENT_TYPE)
    ) {
      const MESSAGE = 'Missing required configuration.type parameter';
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }
    const MESSAGE_UNKNOWN_CLIENT_TYPE = `Unsupported object storage client type! [Actual: ${CLIENT_TYPE}]`;
    let retVal;
    switch (CLIENT_TYPE) {
      case OBJECT_STORAGE_TYPES.MINIO:
        retVal = await createMinioObjectStorageClient(configuration);
        break;
      default:
        throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, MESSAGE_UNKNOWN_CLIENT_TYPE);
    }
    return retVal;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(createObjectStorageClient.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

const createObjectStorageClients = async (
  configurations: Array<IObjectStorageClientConfigurationV1>
) => {
  try {
    if (
      !lodash.isArray(configurations)
    ) {
      const MESSAGE = 'Wrong type of provided parameter configurations! [Expected: Array]';
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, MESSAGE, {
        configurations
      });
    }
    const PROMISES = [];
    for (const CONFIGURATION of configurations) {
      PROMISES.push(createObjectStorageClient(CONFIGURATION));
    }
    const RET_VAL = await Promise.all(PROMISES);
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(createObjectStorageClients.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

export {
  createObjectStorageClient,
  createObjectStorageClients,
}
