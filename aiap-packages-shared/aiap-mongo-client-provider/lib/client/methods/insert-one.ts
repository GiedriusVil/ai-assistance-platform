/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = `aiap-mongo-client-provider-client-insert-one`;
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import {
  formatIntoAcaError,
  appendDataToError,
} from '@ibm-aca/aca-utils-errors';

import {
  CollectionOptions,
  Document,
  OptionalId,
  InsertOneOptions,
  InsertOneResult,
} from 'mongodb';

import { logMethodParams } from '../utils';

import {
  AiapMongoClientV1,
} from '..';

const _insertOne = async (
  client: AiapMongoClientV1,
  context: {
    user?: {
      id: string,
    }
  },
  params: {
    collection: string,
    collectionOptions: CollectionOptions,
    doc: OptionalId<Document>,
    options: InsertOneOptions,
  },
): Promise<InsertOneResult<Document>> => {
  const CONTEXT_USER_ID = context?.user?.id;

  const PARAMS_COLLECTION = params?.collection;
  const PARAMS_COLLECTION_OPTIONS = params?.collectionOptions;

  const PARAMS_DOC = params?.doc;
  const PARAMS_OPTIONS = params?.options;
  try {
    const DB = await client.getDB();
    const RET_VAL = await DB
      .collection(PARAMS_COLLECTION, PARAMS_COLLECTION_OPTIONS)
      .insertOne(PARAMS_DOC, PARAMS_OPTIONS);

    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, {
      CONTEXT_USER_ID,
      PARAMS_COLLECTION,
      PARAMS_COLLECTION_OPTIONS,
      PARAMS_DOC,
      PARAMS_OPTIONS,
    });
    logger.error(_insertOne.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

const insertOne = (
  client: AiapMongoClientV1,
  context: {
    user?: {
      id: string,
    }
  },
  params: {
    collection: string,
    collectionOptions: CollectionOptions,
    doc: OptionalId<Document>,
    options: InsertOneOptions,
  },
) => {
  const RET_VAL = async (bail, attempt): Promise<InsertOneResult<Document>> => {
    try {
      logMethodParams(insertOne.name, context, params);
      const RET_VAL = await _insertOne(client, context, params);
      return RET_VAL;
    } catch (error) {
      const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
      appendDataToError(ACA_ERROR, { attempt });
      logger.error(insertOne.name, { ACA_ERROR })
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
  insertOne,
}
