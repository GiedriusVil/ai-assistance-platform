/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-object-storage-datasource-mongo';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);


import {
  formatIntoAcaError,
  appendDataToError,
} from '@ibm-aca/aca-utils-errors';

import {
  createIndex,
} from '@ibm-aiap/aiap-utils-mongo';

import {
  IContextV1,
} from '@ibm-aiap/aiap--types-server';

import {
  BaseDatasourceMongoV1,
} from '@ibm-aiap/aiap--types-datasource';

import {
  IDatasourceObjectStorageV1,
  IDatasourceConfigurationObjectStorageV1,
  //
  //
  IDatasourceObjectStorageCollectionsV1,
  // bucket-changes
  IBucketChangesDeleteManyByIdsParamsV1,
  IBucketChangesDeleteManyByIdsResponseV1,
  IBucketChangesFindManyByQueryParamsV1,
  IBucketChangesFindManyByQueryResponseV1,
  IBucketChangesFindOneByIdParamsV1,
  IBucketChangesSaveOneParamsV1,
  IBucketChangesV1,
  // buckets
  IBucketDeleteManyByIdsParamsV1,
  IBucketDeleteManyByIdsResponseV1,
  IBucketFindManyByQueryParamsV1,
  IBucketFindManyByQueryResponseV1,
  IBucketFindOneByIdParamsV1,
  IBucketSaveOneParamsV1,
  IBucketV1,
  // file-changes, 
  IFileFindManyByQueryParamsV1,
  IFileChangesDeleteManyByIdsParamsV1,
  IFileChangesDeleteManyByIdsResponseV1,
  IFileChangesFindManyByQueryParamsV1,
  IFileChangesFindManyByQueryResponseV1,
  IFileChangesFindOneByIdParamsV1,
  IFileChangesSaveOneParamsV1,
  IFileChangesV1,
  // 
  IFileDeleteManyByIdsParamsV1,
  IFileDeleteManyByIdsResponseV1,
  IFileFindManyByQueryResponseV1,
  IFileFindOneByIdParamsV1,
  IFileSaveOneParamsV1,
  IFileV1,
} from '../types';

import {
  sanitizedCollectionsFromConfiguration,
} from './collections-utils';

import * as _bucketsChanges from './buckets-changes';
import * as _buckets from './buckets';
import * as _filesChanges from './files-changes';
import * as _files from './files';


export class ObjectStorageDatasourceMongoV1
  extends BaseDatasourceMongoV1<IDatasourceConfigurationObjectStorageV1>
  implements IDatasourceObjectStorageV1 {

  _collections: IDatasourceObjectStorageCollectionsV1;

  constructor(
    configuration: IDatasourceConfigurationObjectStorageV1,
  ) {
    super(configuration);
    try {
      this._collections = sanitizedCollectionsFromConfiguration(this.configuration);
    } catch (error) {
      const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
      appendDataToError(ACA_ERROR, { configuration })
      logger.error('constructor', { ACA_ERROR });
    }
  }

  async initialize() {
    await this._ensureIndexes();
  }

  async _ensureIndexes() {
    try {
      const DB = await this._getDB();
      const COLLECTIONS = this._collections;
      await createIndex(DB, COLLECTIONS.buckets, { created: 1 });
    } catch (error) {
      const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
      ACA_ERROR.configuration = this.configuration;
      logger.error(this._ensureIndexes.name, { ACA_ERROR });
      throw ACA_ERROR;
    }
  }

  get bucketsChanges() {
    const RET_VAL = {
      deleteManyByIds: (
        context: IContextV1,
        params: IBucketChangesDeleteManyByIdsParamsV1,
      ): Promise<IBucketChangesDeleteManyByIdsResponseV1> => {
        return _bucketsChanges.deleteManyByIds(this, context, params);
      },
      findManyByQuery: (
        context: IContextV1,
        params: IBucketChangesFindManyByQueryParamsV1,
      ): Promise<IBucketChangesFindManyByQueryResponseV1> => {
        return _bucketsChanges.findManyByQuery(this, context, params);
      },
      findOneById: (
        context: IContextV1,
        params: IBucketChangesFindOneByIdParamsV1,
      ): Promise<IBucketChangesV1> => {
        return _bucketsChanges.findOneById(this, context, params);
      },
      saveOne: (
        context: IContextV1,
        params: IBucketChangesSaveOneParamsV1,
      ): Promise<IBucketChangesV1> => {
        return _bucketsChanges.saveOne(this, context, params)
      },
    };
    return RET_VAL;
  }


  get buckets() {
    const RET_VAL = {
      deleteManyByIds: (
        context: IContextV1,
        params: IBucketDeleteManyByIdsParamsV1,
      ): Promise<IBucketDeleteManyByIdsResponseV1> => {
        return _buckets.deleteManyByIds(this, context, params);
      },
      findManyByQuery: (
        context: IContextV1,
        params: IBucketFindManyByQueryParamsV1,
      ): Promise<IBucketFindManyByQueryResponseV1> => {
        return _buckets.findManyByQuery(this, context, params);
      },
      findOneById: (
        context: IContextV1,
        params: IBucketFindOneByIdParamsV1,
      ): Promise<IBucketV1> => {
        return _buckets.findOneById(this, context, params);
      },
      saveOne: (
        context: IContextV1,
        params: IBucketSaveOneParamsV1,
      ): Promise<IBucketV1> => {
        return _buckets.saveOne(this, context, params);
      },
    };
    return RET_VAL;
  }


  get filesChanges() {
    const RET_VAL = {
      deleteManyByIds: (
        context: IContextV1,
        params: IFileChangesDeleteManyByIdsParamsV1,
      ): Promise<IFileChangesDeleteManyByIdsResponseV1> => {
        return _filesChanges.deleteManyByIds(this, context, params);
      },
      findManyByQuery: (
        context: IContextV1,
        params: IFileChangesFindManyByQueryParamsV1,
      ): Promise<IFileChangesFindManyByQueryResponseV1> => {
        return _filesChanges.findManyByQuery(this, context, params);
      },
      findOneById: (
        context: IContextV1,
        params: IFileChangesFindOneByIdParamsV1,
      ): Promise<IFileChangesV1> => {
        return _filesChanges.findOneById(this, context, params);
      },
      saveOne: (
        context: IContextV1,
        params: IFileChangesSaveOneParamsV1,
      ): Promise<IFileChangesV1> => {
        return _filesChanges.saveOne(this, context, params)
      },
    }
    return RET_VAL;
  }

  get files() {
    const RET_VAL = {
      deleteManyByIds: (
        context: IContextV1,
        params: IFileDeleteManyByIdsParamsV1,
      ): Promise<IFileDeleteManyByIdsResponseV1> => {
        return _files.deleteManyByIds(this, context, params);
      },
      findManyByQuery: (
        context: IContextV1,
        params: IFileFindManyByQueryParamsV1,
      ): Promise<IFileFindManyByQueryResponseV1> => {
        return _files.findManyByQuery(this, context, params);
      },
      findOneById: (
        context: IContextV1,
        params: IFileFindOneByIdParamsV1,
      ): Promise<IFileV1> => {
        return _files.findOneById(this, context, params);
      },
      saveOne: (
        context: IContextV1,
        params: IFileSaveOneParamsV1,
      ): Promise<IFileV1> => {
        return _files.saveOne(this, context, params)
      },
    };
    return RET_VAL;
  }

}

