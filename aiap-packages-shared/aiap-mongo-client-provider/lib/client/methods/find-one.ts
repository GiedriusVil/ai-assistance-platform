/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = `aiap-mongo-client-provider-client-find-one`;
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
  WithId,
} from 'mongodb';

import { logMethodParams } from '../utils';

import {
  AiapMongoClientV1,
} from '..';

const _findOne = async (
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
    options: FindOptions,
  },
): Promise<WithId<Document>> => {
  const CONTEXT_USER_ID = context?.user?.id;

  const PARAMS_COLLECTION = params?.collection;
  const PARAMS_COLLECTION_OPTIONS = params?.collectionOptions;

  const PARAMS_FILTER = params?.filter;
  const PARAMS_OPTIONS = params?.options;
  try {
    const DB = await client.getDB();
    const RET_VAL = await DB
      .collection(PARAMS_COLLECTION, PARAMS_COLLECTION_OPTIONS)
      .findOne(PARAMS_FILTER, PARAMS_OPTIONS);

    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, {
      CONTEXT_USER_ID,
      PARAMS_COLLECTION,
      PARAMS_COLLECTION_OPTIONS,
      PARAMS_FILTER,
      PARAMS_OPTIONS,
    });
    logger.error(_findOne.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

const findOne = (
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
    options: FindOptions,
  },
) => {
  const RET_VAL = async (bail, attempt) => {
    try {
      logMethodParams(findOne.name, context, params);
      const RET_VAL = await _findOne(client, context, params);
      return RET_VAL;
    } catch (error) {
      const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
      appendDataToError(ACA_ERROR, { attempt });
      logger.error(findOne.name, { ACA_ERROR })
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
  findOne,
}
