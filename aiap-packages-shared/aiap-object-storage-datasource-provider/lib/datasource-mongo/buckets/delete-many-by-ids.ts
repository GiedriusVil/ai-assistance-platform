/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-object-storage-datasource-mongo-buckets-delete-many-by-ids';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import { ReadPreference } from 'mongodb';

import lodash from '@ibm-aca/aca-wrapper-lodash';

import {
  formatIntoAcaError,
  throwAcaError,
  ACA_ERROR_TYPE,
  appendDataToError,
} from '@ibm-aca/aca-utils-errors';

import {
  IContextV1,
} from '@ibm-aiap/aiap--types-server';

import {
  ObjectStorageDatasourceMongoV1,
} from '../../datasource-mongo';

import {
  IBucketDeleteManyByIdsParamsV1,
  IBucketDeleteManyByIdsResponseV1,
} from '../../types';

const deleteManyByIds = async (
  datasource: ObjectStorageDatasourceMongoV1,
  context: IContextV1,
  params: IBucketDeleteManyByIdsParamsV1,
): Promise<IBucketDeleteManyByIdsResponseV1> => {
  const CONTEXT_USER_ID = context?.user?.id;

  const COLLECTION = datasource._collections.buckets;
  const COLLECTION_OPTIONS = { readPreference: ReadPreference.PRIMARY };

  let ids;

  let filter;
  try {
    if (
      lodash.isEmpty(params?.ids)
    ) {
      const MESSAGE = `Missing required params.ids parameter!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }
    if (
      !lodash.isArray(params?.ids)
    ) {
      const MESSAGE = `Wrong type params.ids parameter! [Expected - Array]`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }
    ids = params?.ids;

    filter = {
      _id: {
        $in: ids,
      }
    };
    const MONGO_CLIENT = await datasource._getMongoClient();
    await MONGO_CLIENT
      .__deleteMany(context, {
        collection: COLLECTION,
        collectionOptions: COLLECTION_OPTIONS,
        filter: filter
      });

    const RET_VAL: IBucketDeleteManyByIdsResponseV1 = {
      ids: ids,
    };
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, {
      CONTEXT_USER_ID,
      params,
      filter,
    });
    logger.error(deleteManyByIds.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

export {
  deleteManyByIds,
}
