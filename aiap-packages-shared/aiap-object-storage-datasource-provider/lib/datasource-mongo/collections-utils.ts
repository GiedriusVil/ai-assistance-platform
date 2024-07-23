/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-object-storage-datasource-mongo-collections-utils';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import lodash from '@ibm-aca/aca-wrapper-lodash';

import {
  formatIntoAcaError,
} from '@ibm-aca/aca-utils-errors';

import {
  IDatasourceConfigurationObjectStorageV1,
  IDatasourceObjectStorageCollectionsV1,
} from '../types';

const DEFAULT_COLLECTIONS = {
  buckets: 'objectStorageBuckets',
  bucketsChanges: 'objectStorageBucketsChanges',
  files: 'objectStorageFiles',
  filesChanges: 'objectStorageFilesChanges',
};

const sanitizedCollectionsFromConfiguration = (
  configuration: IDatasourceConfigurationObjectStorageV1,
): IDatasourceObjectStorageCollectionsV1 => {
  try {
    const COLLECTIONS_CONFIGURATION = configuration?.collections;

    const BUCKETS_CHANGES = COLLECTIONS_CONFIGURATION?.bucketsChanges;
    const BUCKETS = COLLECTIONS_CONFIGURATION?.buckets;
    const FILES_CHANGES = COLLECTIONS_CONFIGURATION?.filesChanges;
    const FILES = COLLECTIONS_CONFIGURATION?.files;

    const RET_VAL = lodash.cloneDeep(DEFAULT_COLLECTIONS);
    if (
      !lodash.isEmpty(BUCKETS_CHANGES)
    ) {
      RET_VAL.bucketsChanges = BUCKETS_CHANGES;
    }
    if (
      !lodash.isEmpty(BUCKETS)
    ) {
      RET_VAL.buckets = BUCKETS;
    }
    if (
      !lodash.isEmpty(FILES_CHANGES)
    ) {
      RET_VAL.filesChanges = FILES_CHANGES;
    }
    if (
      !lodash.isEmpty(FILES)
    ) {
      RET_VAL.files = FILES;
    }
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(sanitizedCollectionsFromConfiguration.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

export {
  sanitizedCollectionsFromConfiguration,
}
