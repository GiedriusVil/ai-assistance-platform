/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-lambda-modules-datasource-mongo-modules-delete-one-by-id';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import lodash from '@ibm-aca/aca-wrapper-lodash';

import { ReadPreference } from 'mongodb';

import { 
  throwAcaError, 
  ACA_ERROR_TYPE, 
  formatIntoAcaError, 
  appendDataToError 
} from '@ibm-aca/aca-utils-errors';

import {
  IContextV1,
} from '@ibm-aiap/aiap--types-server';

import {
  LambdaModulesDatasourceMongoV1,
} from '../';

import {
  IDeleteLambdaModuleByIdParamsV1,
  IDeleteLambdaModuleByIdResponseV1,
} from '../../types';

const deleteOneById = async (
  datasource: LambdaModulesDatasourceMongoV1, 
  context: IContextV1, 
  params: IDeleteLambdaModuleByIdParamsV1): Promise<IDeleteLambdaModuleByIdResponseV1> => {
  const CONTEXT_USER_ID = context?.user?.id;
  const COLLECTION = datasource._collections.modules;
  const COLLECTION_OPTIONS = { readPreference: ReadPreference.PRIMARY };
  const PARAMS_ID = params?.id;
  let filter;
  try {
    if (
      lodash.isEmpty(PARAMS_ID)
    ) {
      const MESSAGE = `Missing required params.id parameter!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }
    filter = {
      _id: PARAMS_ID
    };
    const ACA_MONGO_CLIENT = await datasource._getMongoClient();
    await ACA_MONGO_CLIENT
      .__findOneAndDelete(context, {
        collection: COLLECTION,
        collectionOptions: COLLECTION_OPTIONS,
        filter: filter,
      });
    const RET_VAL = {
      id: PARAMS_ID,
      status: 'DELETED'
    };
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, { CONTEXT_USER_ID, params, filter });
    logger.error(`${deleteOneById.name}`, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

export {
  deleteOneById,
};
