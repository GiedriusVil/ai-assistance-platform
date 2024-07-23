/*
  © Copyright IBM Corporation 2023. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import {
  IContextV1,
} from '@ibm-aiap/aiap--types-server';

import {
  // 
  IBucketChangesDeleteManyByIdsParamsV1,
  IBucketChangesDeleteManyByIdsResponseV1,
  IBucketChangesFindManyByQueryParamsV1,
  IBucketChangesFindManyByQueryResponseV1,
  IBucketChangesFindOneByIdParamsV1,
  IBucketChangesSaveOneParamsV1,
  IBucketChangesV1,
  //
  IBucketDeleteManyByIdsParamsV1,
  IBucketDeleteManyByIdsResponseV1,
  IBucketFindManyByQueryParamsV1,
  IBucketFindManyByQueryResponseV1,
  IBucketFindOneByIdParamsV1,
  IBucketSaveOneParamsV1,
  IBucketV1,
  //
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
  IFileFindManyByQueryParamsV1,
  IFileFindManyByQueryResponseV1,
  IFileFindOneByIdParamsV1,
  IFileSaveOneParamsV1,
  IFileV1,
  //
} from '..';


interface IDatasourceObjectStorageV1 {

  get bucketsChanges(): {
    deleteManyByIds(
      context: IContextV1,
      params: IBucketChangesDeleteManyByIdsParamsV1,
    ): Promise<IBucketChangesDeleteManyByIdsResponseV1>,
    findManyByQuery(
      context: IContextV1,
      params: IBucketChangesFindManyByQueryParamsV1,
    ): Promise<IBucketChangesFindManyByQueryResponseV1>,
    findOneById(
      context: IContextV1,
      params: IBucketChangesFindOneByIdParamsV1,
    ): Promise<IBucketChangesV1>,
    saveOne(
      context: IContextV1,
      params: IBucketChangesSaveOneParamsV1,
    ): Promise<IBucketChangesV1>,
  }

  get buckets(): {
    deleteManyByIds(
      context: IContextV1,
      params: IBucketDeleteManyByIdsParamsV1,
    ): Promise<IBucketDeleteManyByIdsResponseV1>,
    findManyByQuery(
      context: IContextV1,
      params: IBucketFindManyByQueryParamsV1,
    ): Promise<IBucketFindManyByQueryResponseV1>,
    findOneById(
      context: IContextV1,
      params: IBucketFindOneByIdParamsV1,
    ): Promise<IBucketV1>,
    saveOne(
      context: IContextV1,
      params: IBucketSaveOneParamsV1,
    ): Promise<IBucketV1>,
  }

  get filesChanges(): {
    deleteManyByIds(
      context: IContextV1,
      params: IFileChangesDeleteManyByIdsParamsV1,
    ): Promise<IFileChangesDeleteManyByIdsResponseV1>,
    findManyByQuery(
      context: IContextV1,
      params: IFileChangesFindManyByQueryParamsV1,
    ): Promise<IFileChangesFindManyByQueryResponseV1>,
    findOneById(
      context: IContextV1,
      params: IFileChangesFindOneByIdParamsV1,
    ): Promise<IFileChangesV1>,
    saveOne(
      context: IContextV1,
      params: IFileChangesSaveOneParamsV1,
    ): Promise<IFileChangesV1>,
  }

  get files(): {
    deleteManyByIds(
      context: IContextV1,
      params: IFileDeleteManyByIdsParamsV1,
    ): Promise<IFileDeleteManyByIdsResponseV1>,
    findManyByQuery(
      context: IContextV1,
      params: IFileFindManyByQueryParamsV1,
    ): Promise<IFileFindManyByQueryResponseV1>,
    findOneById(
      context: IContextV1,
      params: IFileFindOneByIdParamsV1,
    ): Promise<IFileV1>,
    saveOne(
      context: IContextV1,
      params: IFileSaveOneParamsV1,
    ): Promise<IFileV1>,
  }

}

export {
  IDatasourceObjectStorageV1,
}
