/*
  © Copyright IBM Corporation 2023. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import {
  IBucketChangesV1,
  IBucketV1,
  IFileChangesV1,
  IFileV1,
} from '../data-entities';

// bucket-changes

export interface IBucketChangesDeleteManyByIdsParamsV1 {
  ids: Array<string>,
}

export interface IBucketChangesDeleteManyByIdsResponseV1 {
  ids: Array<string>,
}

export interface IBucketChangesFindManyByQueryParamsV1 {
  query: {
    filter?: {
      search?: string,
      [key: string]: any,
    },
    sort?: {
      field: string,
      direction: string,
    },
    pagination: {
      page: any,
      size: any,
    },
  },
}

export interface IBucketChangesFindManyByQueryResponseV1 {
  total: number,
  items: Array<IBucketChangesV1>,
}

export interface IBucketChangesFindOneByIdParamsV1 {
  id: string,
}

export interface IBucketChangesSaveOneParamsV1 {
  value: IBucketChangesV1,
}

// bucket

export interface IBucketDeleteManyByIdsParamsV1 {
  ids: Array<string>,
}

export interface IBucketDeleteManyByIdsResponseV1 {
  ids: Array<string>,
}

export interface IBucketFindManyByQueryParamsV1 {
  query: {
    filter?: {
      search?: string,
      [key: string]: any,
    },
    sort?: {
      field: string,
      direction: string,
    },
    pagination: {
      page: any,
      size: any,
    },
  },
}

export interface IBucketFindManyByQueryResponseV1 {
  total: number,
  items: Array<IBucketV1>,
}

export interface IBucketFindOneByIdParamsV1 {
  id: string,
}

export interface IBucketSaveOneParamsV1 {
  value: IBucketV1,
}

// file-changes

export interface IFileChangesDeleteManyByIdsParamsV1 {
  ids: Array<string>,
}

export interface IFileChangesDeleteManyByIdsResponseV1 {
  ids: Array<string>,
}

export interface IFileChangesFindManyByQueryParamsV1 {
  query: {
    filter?: {
      search?: string,
      bucketId: string,
      [key: string]: any,
    },
    sort?: {
      field: string,
      direction: string,
    },
    pagination: {
      page: any,
      size: any,
    },
  },
}

export interface IFileChangesFindManyByQueryResponseV1 {
  total: number,
  items: Array<IFileChangesV1>,
}

export interface IFileChangesFindOneByIdParamsV1 {
  id: string,
}

export interface IFileChangesSaveOneParamsV1 {
  value: IFileChangesV1,
}

// file

export interface IFileDeleteManyByIdsParamsV1 {
  ids: Array<string>,
}

export interface IFileDeleteManyByIdsResponseV1 {
  ids: Array<string>,
}

export interface IFileFindManyByQueryParamsV1 {
  query: {
    filter?: {
      search?: string,
      bucketId: string,
      [key: string]: any,
    },
    sort?: {
      field: string,
      direction: string,
    },
    pagination: {
      page: any,
      size: any,
    },
  },
}

export interface IFileFindManyByQueryResponseV1 {
  total: number,
  items: Array<IFileV1>,
}

export interface IFileFindOneByIdParamsV1 {
  id: string,
}

export interface IFileSaveOneParamsV1 {
  value: IFileV1,
}
