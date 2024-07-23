/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import ramda from '@ibm-aca/aca-wrapper-ramda';

import {
  IDatasourceConfigurationObjectStorageV1,
} from '../types';

const datasource = (
  flatClient: {
    name: string,
    type: string,
    client: string,
    collectionBuckets: string,
    collectionBucketsChanges: string,
    collectionFiles: string,
    collectionFilesChanges: string,
  }
): IDatasourceConfigurationObjectStorageV1 => {
  const RET_VAL = {
    name: flatClient?.name,
    type: flatClient?.type,
    client: flatClient?.client,
    collections: {
      bucketsChanges: flatClient?.collectionBucketsChanges,
      buckets: flatClient?.collectionBuckets,
      filesChanges: flatClient?.collectionFilesChanges,
      files: flatClient?.collectionFiles,
    }
  }
  return RET_VAL;
}

const datasources = (
  flatSources: Array<{
    name: string,
    type: string,
    client: string,
    collectionBucketsChanges: string,
    collectionBuckets: string,
    collectionFilesChanges: string,
    collectionFiles: string,
  }>
): Array<IDatasourceConfigurationObjectStorageV1> => {
  const RET_VAL = [];
  if (
    !ramda.isNil(flatSources)
  ) {
    for (const FLATTEN_SOURCE of flatSources) {
      if (
        !ramda.isNil(FLATTEN_SOURCE)
      ) {
        RET_VAL.push(datasource(FLATTEN_SOURCE));
      }
    }
  }
  return RET_VAL;
}

const transformRawConfiguration = async (
  rawConfiguration,
  provider,
): Promise<{
  sources: Array<IDatasourceConfigurationObjectStorageV1>,
}> => {
  const CLIENTS_FLAT = provider.getKeys(
    'OBJECT_STORAGE_DATASOURCE_PROVIDER',
    [
      'NAME',
      'TYPE',
      'CLIENT',
      'COLLECTION_BUCKETS_CHANGES',
      'COLLECTION_BUCKETS',
      'COLLECTION_FILES_CHANGES',
      'COLLECTION_FILES',
    ]
  );
  const DATASOURCES = datasources(CLIENTS_FLAT);
  const RET_VAL = provider.isEnabled('OBJECT_STORAGE_DATASOURCE_PROVIDER_ENABLED', false, {
    sources: DATASOURCES
  });
  return RET_VAL;
}

export {
  transformRawConfiguration,
}
