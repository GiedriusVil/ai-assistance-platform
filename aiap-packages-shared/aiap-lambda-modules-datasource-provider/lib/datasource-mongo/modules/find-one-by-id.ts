/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-lambda-modules-datasource-mongo-modules-find-one-by-id';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import lodash from '@ibm-aca/aca-wrapper-lodash';

import validator from 'validator';

import { ReadPreference } from 'mongodb';

import { 
  throwAcaError, 
  ACA_ERROR_TYPE, 
  formatIntoAcaError, 
  appendDataToError 
} from '@ibm-aca/aca-utils-errors';

import { sanitizeIdAttribute } from '@ibm-aiap/aiap-utils-mongo';

import {
  IContextV1,
  ILambdaModuleV1,
} from '@ibm-aiap/aiap--types-server';

import {
  LambdaModulesDatasourceMongoV1,
} from '../';

import {
  IFindLambdaModuleByIdParamsV1,
} from '../../types';

const findOneById = async (
  datasource: LambdaModulesDatasourceMongoV1, 
  context: IContextV1, 
  params: IFindLambdaModuleByIdParamsV1): Promise<ILambdaModuleV1> => {
  const CONTEXT_USER_ID = context?.user?.id;
  const COLLECTION = datasource._collections.modules;
  const COLLECTION_OPTIONS = { readPreference: ReadPreference.SECONDARY_PREFERRED };
  const PARAMS_ID = params?.id;
  let query;
  try {
    if (
      lodash.isEmpty(PARAMS_ID)
    ) {
      const MESSAGE = `Missing required params.id parameter!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }

    if (
      !validator.isMongoId(PARAMS_ID) &&
      !validator.isAlphanumeric(PARAMS_ID, 'en-US', { ignore: '_-' })
    ) {
      const ERROR_MESSAGE = `Required parameter params.id is invalid!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, ERROR_MESSAGE);
    }

    query = { _id: { $eq: PARAMS_ID } };

    const ACA_MONGO_CLIENT = await datasource._getMongoClient();
    const RET_VAL = await ACA_MONGO_CLIENT
      .__findOne(context, {
        collection: COLLECTION,
        collectionOptions: COLLECTION_OPTIONS,
        filter: query,
      });
    sanitizeIdAttribute(RET_VAL);

    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, { CONTEXT_USER_ID, params, query });
    logger.error(`${findOneById.name}`, { ACA_ERROR });
    throw error;
  }
}

export {
  findOneById,
};
