/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-object-storage-client-provider-client-minio';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import lodash from '@ibm-aca/aca-wrapper-lodash';

import {
  Client,
  ClientOptions,
  ItemBucketMetadata,
} from 'minio';

import {
  ACA_ERROR_TYPE,
  formatIntoAcaError,
  throwAcaError,
} from '@ibm-aca/aca-utils-errors';

import {
  ObjectStorageClient,
} from '../client';

import {
  IObjectStorageClientConfigurationMinioV1,
} from '../types';

import { IContextV1 } from '@ibm-aiap/aiap--types-server';

class ObjectStorageClientMinioV1 extends ObjectStorageClient<IObjectStorageClientConfigurationMinioV1> {

  _client: Client;

  constructor(
    configuration: IObjectStorageClientConfigurationMinioV1,
  ) {
    try {
      super(configuration);
      if (
        lodash.isEmpty(this.configuration?.accessKey)
      ) {
        const ERROR_MESSAGE = `Missing required this.configuration?.accessKey attribute`;
        throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, ERROR_MESSAGE);
      }
      if (
        lodash.isEmpty(this.configuration?.secretKey)
      ) {
        const ERROR_MESSAGE = `Missing required this.configuration?.secretKey attribute`;
        throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, ERROR_MESSAGE);
      }

    } catch (error) {
      const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
      logger.error('constructor', { ACA_ERROR });
      throw ACA_ERROR;
    }
  }

  async initialize(): Promise<void> {
    try { 
      const TMP_CONFIGURATION: ClientOptions = {
        endPoint: this.configuration.endPoint,
        useSSL: this.configuration.useSSL,
        accessKey: this.configuration.accessKey,
        secretKey: this.configuration.secretKey,
      };
      if (
        lodash.isNumber(this.configuration.port)
      ) {
        TMP_CONFIGURATION.port = this.configuration.port;
      }
      this._client = new Client(TMP_CONFIGURATION);
    } catch (error) {
      const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
      logger.error(this.initialize.name, { ACA_ERROR });
      throw ACA_ERROR;
    }
  }

  async saveBucket(
    context: IContextV1,
    params: {
      value: {
        name: string;
      };
    }
  ) {
    let bucketName;
    try {
      if (
        lodash.isEmpty(params?.value?.name)
      ) {
        const ERROR_MESSAGE = `Missing required params?.value?.name parameter!`;
        throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, ERROR_MESSAGE);
      }
      bucketName = params?.value?.name;
      await this._client.makeBucket(bucketName);
    } catch (error) {
      const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
      logger.error(this.saveBucket.name, { ACA_ERROR });
      throw ACA_ERROR;
    }
  }

  async checkBucketExistance(
    context: IContextV1,
    params: {
      name: string;
    }
  ): Promise<boolean> {
    try {
      if (
        lodash.isEmpty(params?.name)
      ) {
        const ERROR_MESSAGE = `Missing required params?.bucketName parameter!`;
        throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, ERROR_MESSAGE);
      }
      const RET_VAL = await this._client.bucketExists(params?.name);
      return RET_VAL;
    } catch (error) {
      const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
      logger.error(this.saveBucketTags.name, { ACA_ERROR });
      throw ACA_ERROR;
    }
  }

  async saveBucketTags(
    context: IContextV1,
    params: {
      name: string;
      tags: {
        [key: string]: string;
      };
    }) {
    try {
      if (
        lodash.isEmpty(params?.name)
      ) {
        const ERROR_MESSAGE = `Missing required params?.name parameter!`;
        throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, ERROR_MESSAGE);
      }
      await this._client.setBucketTagging(params?.name, params?.tags);
    } catch (error) {
      const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
      logger.error(this.saveBucketTags.name, { ACA_ERROR });
      throw ACA_ERROR;
    }
  }

  async saveFile(
    context: IContextV1,
    params: {
      name: string;
      bucketName: string;
      filePath: string;
      metaData: any;
    }) {
    try {
      if (
        lodash.isEmpty(params?.name)
      ) {
        const ERROR_MESSAGE = `Missing required params?.name parameter!`;
        throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, ERROR_MESSAGE);
      }
      if (
        lodash.isEmpty(params?.bucketName)
      ) {
        const ERROR_MESSAGE = `Missing required params?.bucketName parameter!`;
        throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, ERROR_MESSAGE);
      }
      if (
        lodash.isEmpty(params?.filePath)
      ) {
        const ERROR_MESSAGE = `Missing required params?.filePath parameter!`;
        throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, ERROR_MESSAGE);
      }
      const RET_VAL = await this._client.fPutObject(
        params?.bucketName,
        params?.name,
        params?.filePath,
        params?.metaData,
      );
      return RET_VAL;
    } catch (error) {
      const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
      logger.error(this.saveFile.name, { ACA_ERROR });
      throw ACA_ERROR;
    }
  }

}

export {
  ObjectStorageClientMinioV1,
}
