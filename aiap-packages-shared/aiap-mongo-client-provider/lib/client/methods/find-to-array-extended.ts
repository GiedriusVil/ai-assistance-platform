/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = `aiap-mongo-client-provider-client-find-to-array-extended`;
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import {
  formatIntoAcaError,
  appendDataToError,
} from '@ibm-aca/aca-utils-errors';

import {
  CollectionOptions,
  Document,
  Filter,
  FindOptions,
  Sort,
} from 'mongodb';

import { logMethodParams } from '../utils';

import {
  AiapMongoClientV1,
} from '..';

const _findToArrayExtended = async (
  client: AiapMongoClientV1,
  context: {
    user?: {
      id: string,
    }
  },
  params: {
    collection: string,
    collectionOptions: CollectionOptions,
    filter: Filter<Document>,
    options: FindOptions<Document>,
    project: Document,
    sort: Sort,
    limit: number,
  },
): Promise<Document> => {
  const CONTEXT_USER_ID = context?.user?.id;

  const PARAMS_COLLECTION = params?.collection;
  const PARAMS_COLLECTION_OPTIONS = params?.collectionOptions;

  const PARAMS_FILTER = params?.filter;
  const PARAMS_OPTIONS = params?.options;

  const PROJECTION_OPTIONS = params?.project;
  const SORT = params?.sort;
  const LIMIT = params?.limit;
  try {
    const DB = await client.getDB();
    const RET_VAL = await DB
      .collection(PARAMS_COLLECTION, PARAMS_COLLECTION_OPTIONS)
      .find(PARAMS_FILTER, PARAMS_OPTIONS)
      .project(PROJECTION_OPTIONS)
      .sort(SORT)
      .limit(LIMIT)
      .toArray();

    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, {
      CONTEXT_USER_ID,
      PARAMS_COLLECTION,
      PARAMS_COLLECTION_OPTIONS,
      PARAMS_FILTER,
      PARAMS_OPTIONS,
      PROJECTION_OPTIONS,
    });
    logger.error(_findToArrayExtended.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

const findToArrayExtended = (
  client: AiapMongoClientV1,
  context: {
    user?: {
      id: string,
    }
  },
  params: {
    collection: string,
    collectionOptions: CollectionOptions,
    filter: Filter<Document>,
    options: FindOptions<Document>,
    project: Document,
    sort: Sort,
    limit: number,
  },
) => {
  const RET_VAL = async (bail, attempt): Promise<Document> => {
    try {
      logMethodParams(findToArrayExtended.name, context, params);
      const RET_VAL = await _findToArrayExtended(client, context, params);
      return RET_VAL;
    } catch (error) {
      const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
      appendDataToError(ACA_ERROR, { attempt });
      logger.error(findToArrayExtended.name, { ACA_ERROR })
      if (
        ACA_ERROR?.external?.name !== 'MongoNetworkError'
      ) {
        bail(ACA_ERROR);
      } else {
        throw ACA_ERROR;
      }
    }
  }
  return RET_VAL;
}

export {
  findToArrayExtended,
}
