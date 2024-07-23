/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-lambda-modules-datasource-mongo-lambda-modules-delete-many-by-ids';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import lodash from '@ibm-aca/aca-wrapper-lodash';

import validator from 'validator';

import { ReadPreference } from 'mongodb';

import { 
  formatIntoAcaError, 
  throwAcaError, 
  ACA_ERROR_TYPE, 
  appendDataToError 
} from '@ibm-aca/aca-utils-errors';

import {
  IContextV1,
} from '@ibm-aiap/aiap--types-server';

import {
  LambdaModulesDatasourceMongoV1,
} from '../';

import {
  IDeleteLambdaModulesByIdsParamsV1,
  IDeleteLambdaModulesByIdsResponseV1,
} from '../../types';

const deleteManyByIds = async (
  datasource: LambdaModulesDatasourceMongoV1, 
  context: IContextV1, 
  params: IDeleteLambdaModulesByIdsParamsV1): Promise<IDeleteLambdaModulesByIdsResponseV1> => {
  const CONTEXT_USER_ID = context?.user?.id;

  const PARAMS_IDS = params?.ids;

  const COLLECTION = datasource._collections.modules;
  const COLLECTION_OPTIONS = { readPreference: ReadPreference.PRIMARY };

  let filter;
  try {
    if (
      lodash.isEmpty(PARAMS_IDS)
    ) {
      const MESSAGE = `Missing required params.ids parameter!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }
    if (
      !lodash.isArray(PARAMS_IDS)
    ) {
      const MESSAGE = `Wront type of params.ids parameter! [Expected: Array]`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }
    for (let tmpId of PARAMS_IDS) {
      if (
        !validator.isMongoId(tmpId) &&
        !validator.isAlphanumeric(tmpId, 'en-US', { ignore: '$_-' })
      ) {
        const ERROR_MESSAGE = 'Invalid params.ids[?] attribute!';
        throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, ERROR_MESSAGE);
      }
    }

    filter = { _id: { $in: PARAMS_IDS } };
    const ACA_MONGO_CLIENT = await datasource._getMongoClient();
    await ACA_MONGO_CLIENT
      .__deleteMany(context, {
        collection: COLLECTION,
        collectionOptions: COLLECTION_OPTIONS,
        filter: filter
      });

    const RET_VAL = {
      ids: PARAMS_IDS,
      status: 'SUCCESS'
    };
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, { CONTEXT_USER_ID, filter });
    logger.error(deleteManyByIds.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

export {
  deleteManyByIds,
};
