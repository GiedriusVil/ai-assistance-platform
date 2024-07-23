/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-object-storage-client-provider-client';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);


import lodash from '@ibm-aca/aca-wrapper-lodash';

import {
  ACA_ERROR_TYPE,
  throwAcaError,
} from '@ibm-aca/aca-utils-errors';

import {
  IContextV1,
} from '@ibm-aiap/aiap--types-server';

import {
  IObjectStorageClientConfigurationV1,
} from '../types';

abstract class ObjectStorageClient<EIObjectStorageClientConfigurationV1 extends IObjectStorageClientConfigurationV1> {

  id: string;
  hash: string;
  name: string;

  configuration: EIObjectStorageClientConfigurationV1;

  constructor(
    configuration: EIObjectStorageClientConfigurationV1,
  ) {
    if (
      lodash.isEmpty(configuration)
    ) {
      const MESSAGE = 'Missing required configuration parameter!';
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.INITIALIZATION_ERROR, MESSAGE);
    }
    this.configuration = configuration;
    this.id = this.configuration?.id;
    this.hash = this.configuration?.hash;
    this.name = this.configuration?.name;
  }

  getName() {
    return this.name;
  }

  abstract initialize(): Promise<void>;

  abstract saveBucket(
    context: IContextV1,
    params: {
      value: {
        name: string
      }
    }
  ): Promise<void>;

  abstract saveBucketTags(
    context: IContextV1,
    params: {
      name: string,
      tags: {
        [key: string]: string,
      },
    }
  ): Promise<void>;

  abstract checkBucketExistance(
    context: IContextV1,
    params: {
      name: string,
    }
  ): Promise<boolean>;

  abstract saveFile(
    context: IContextV1,
    params: {
      name: string,
      bucketName: string,
      filePath: string,
      metaData: any
    }
  ): Promise<any>;


}

export {
  ObjectStorageClient,
}
