/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = `aiap-mongo-client-provider-client-aggregate-to-array`;
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import {
  formatIntoAcaError,
  appendDataToError,
} from '@ibm-aca/aca-utils-errors';

import {
  AggregateOptions,
  CollectionOptions,
  Document,
} from 'mongodb';

import { logMethodParams } from '../utils';

import {
  AiapMongoClientV1,
} from '..';

const _aggregateToArray = async (
  client: AiapMongoClientV1,
  context: {
    user?: {
      id: string
    }
  },
  params: {
    collection: string,
    collectionOptions: CollectionOptions,
    pipeline: Document[],
    options: AggregateOptions,
  },
): Promise<Document[]> => {
  const CONTEXT_USER_ID = context?.user?.id;

  const PARAMS_COLLECTION = params?.collection;
  const PARAMS_COLLECTION_OPTIONS = params?.collectionOptions;
  const PARAMS_PIPELINE = params?.pipeline;
  const PARAMS_OPTIONS = params?.options;

  try {
    const DB = await client.getDB();
    const RET_VAL = await DB
      .collection(PARAMS_COLLECTION, PARAMS_COLLECTION_OPTIONS)
      .aggregate(PARAMS_PIPELINE, PARAMS_OPTIONS)
      .toArray();

    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, {
      CONTEXT_USER_ID,
      PARAMS_COLLECTION,
      PARAMS_COLLECTION_OPTIONS,
      PARAMS_PIPELINE,
      PARAMS_OPTIONS,
    });

    logger.error(_aggregateToArray.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

const aggregateToArray = (
  client: AiapMongoClientV1,
  context: any,
  params: {
    collection: string,
    collectionOptions: CollectionOptions,
    pipeline: Document[],
    options: AggregateOptions,
  },
) => {
  const RET_VAL = async (bail, attempt): Promise<Document[]> => {
    try {
      logMethodParams(aggregateToArray.name, context, params);
      const RET_VAL = await _aggregateToArray(client, context, params);
      return RET_VAL;
    } catch (error) {
      const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
      appendDataToError(ACA_ERROR, { attempt });
      logger.error(aggregateToArray.name, { ACA_ERROR });

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
  aggregateToArray,
}
