/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-chat-app-server-controllers-file-retrieve-file';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);
import { pipeline } from 'stream';

import {
  getDatasourceV1App,
} from '@ibm-aiap/aiap-app-datasource-provider';

import lodash from '@ibm-aca/aca-wrapper-lodash';

import {
  formatIntoAcaError,
  throwAcaError,
  ACA_ERROR_TYPE,
} from '@ibm-aca/aca-utils-errors';

import {
  Client,
  ClientOptions,
} from 'minio';

const retrieveObjectStorageFile = async (req, res) => {
  try {
    const REQUEST_PARAMS = req?.params;
    const TENANT_ID = REQUEST_PARAMS?.tenantId;
    const FILE_REF = REQUEST_PARAMS?.fileRef;
    const BUCKET_REF = REQUEST_PARAMS?.bucketRef;
    const DATASOURCE = getDatasourceV1App();
    const TENANT = await DATASOURCE.tenants.findOneById({}, { id: TENANT_ID });

    if (lodash.isEmpty(TENANT)) {
      const MESSAGE = 'Unable to retrieve tenant!';
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, MESSAGE);
    }

    if (lodash.isEmpty(FILE_REF)) {
      const MESSAGE = 'Missing required req.params.fileRef';
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, MESSAGE);
    }

    if (lodash.isEmpty(BUCKET_REF)) {
      const MESSAGE = 'Missing required req.params.bucketRef';
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, MESSAGE);
    }

    const TENANT_OBJECT_STORAGE = TENANT?.objectStorage;
    const OBJECT_STORAGE_ENDPOINT = TENANT_OBJECT_STORAGE?.endPoint;
    const OBJECT_STORAGE_PORT = TENANT_OBJECT_STORAGE?.port;
    const OBJECT_STORAGE_USE_SSL = TENANT_OBJECT_STORAGE?.useSSL;
    const OBJECT_STORAGE_ACCESS_KEY = TENANT_OBJECT_STORAGE?.accessKey;
    const OBJECT_STORAGE_SECRET_KEY = TENANT_OBJECT_STORAGE?.secretKey;

    if (lodash.isEmpty(OBJECT_STORAGE_ENDPOINT)) {
      const MESSAGE = 'Missing required tenant.objectStorage.endPoint';
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, MESSAGE);
    }

    if (lodash.isEmpty(OBJECT_STORAGE_ACCESS_KEY)) {
      const MESSAGE = 'Missing required tenant.objectStorage.accessKey';
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, MESSAGE);
    }

    if (lodash.isEmpty(OBJECT_STORAGE_SECRET_KEY)) {
      const MESSAGE = 'Missing required tenant.objectStorage.secretKey';
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, MESSAGE);
    }

    const TMP_CONFIGURATION: ClientOptions = {
      endPoint: OBJECT_STORAGE_ENDPOINT,
      useSSL: OBJECT_STORAGE_USE_SSL,
      accessKey: OBJECT_STORAGE_ACCESS_KEY,
      secretKey: OBJECT_STORAGE_SECRET_KEY,
    };

    if (
      lodash.isNumber(OBJECT_STORAGE_PORT)
    ) {
      TMP_CONFIGURATION.port = OBJECT_STORAGE_PORT;
    }
    const CLIENT = new Client(TMP_CONFIGURATION);
    const FILE_METADATA = await CLIENT.statObject(`${BUCKET_REF}`, `${FILE_REF}`);
    const FILE_CONTENT_TYPE = FILE_METADATA?.metaData?.['content-type'];
    const FILE_RETRIEVE_STREAM = await CLIENT.getObject(`${BUCKET_REF}`, `${FILE_REF}`);
    res.writeHead(200, { 'Content-Type': `${FILE_CONTENT_TYPE}` });

    pipeline(FILE_RETRIEVE_STREAM, res, error => {
      if (error) {
        const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
        logger.error(retrieveObjectStorageFile.name, { ACA_ERROR });
      }
    })
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(retrieveObjectStorageFile.name, { ACA_ERROR });
    throw ACA_ERROR;
  }

}

export {
  retrieveObjectStorageFile
}
