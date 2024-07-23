/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = `aca-mongo-client-provider-client-update-many`;
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import {
  formatIntoAcaError,
  appendDataToError,
} from '@ibm-aca/aca-utils-errors';

import {
  CollectionOptions,
  Document,
  Filter,
  UpdateFilter,
  UpdateOptions,
  UpdateResult,
} from 'mongodb';

import { logMethodParams } from '../utils';

import {
  AiapMongoClientV1,
} from '..';

const _updateMany = async (
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
    update: UpdateFilter<Document>,
    options: UpdateOptions,
  },
): Promise<UpdateResult | Document> => {
  const CONTEXT_USER_ID = context?.user?.id;

  const PARAMS_COLLECTION = params?.collection;
  const PARAMS_COLLECTION_OPTIONS = params?.collectionOptions;

  const PARAMS_FILTER = params?.filter;
  const PARAMS_UPDATE = params?.update;
  const PARAMS_OPTIONS = params?.options;
  try {
    const DB = await client.getDB();
    const RET_VAL = await DB
      .collection(PARAMS_COLLECTION, PARAMS_COLLECTION_OPTIONS)
      .updateMany(PARAMS_FILTER, PARAMS_UPDATE, PARAMS_OPTIONS);

    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, {
      CONTEXT_USER_ID,
      PARAMS_COLLECTION,
      PARAMS_COLLECTION_OPTIONS,
      PARAMS_FILTER,
      PARAMS_UPDATE,
      PARAMS_OPTIONS,
    });
    logger.error(_updateMany.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

const updateMany = (
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
    update: UpdateFilter<Document>,
    options: UpdateOptions,
  },
) => {
  const RET_VAL = async (bail, attempt): Promise<UpdateResult | Document> => {
    try {
      logMethodParams(updateMany.name, context, params);
      const RET_VAL = await _updateMany(client, context, params);
      return RET_VAL;
    } catch (error) {
      const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
      appendDataToError(ACA_ERROR, { attempt });
      logger.error(updateMany.name, { ACA_ERROR })
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
  updateMany,
}
