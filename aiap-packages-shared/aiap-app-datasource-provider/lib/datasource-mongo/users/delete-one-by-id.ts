
/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'app-datasource-mongo-users-delete-one-by-id';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const validator = require('validator');

import {
  ReadPreference,
} from 'mongodb';

import lodash from '@ibm-aca/aca-wrapper-lodash';

import {
  IContextV1,
} from '@ibm-aiap/aiap--types-server';

import {
  IParamsV1DeleteUserById,
  IResponseV1DeleteUserById,
} from '@ibm-aiap/aiap--types-domain-app';

import {
  ACA_ERROR_TYPE,
  appendDataToError,
  formatIntoAcaError,
  throwAcaError,
} from '@ibm-aca/aca-utils-errors';

import {
  DatasourceAppV1Mongo,
} from '..';

export const deleteOneById = async (
  datasource: DatasourceAppV1Mongo,
  context: IContextV1,
  params: IParamsV1DeleteUserById,
): Promise<IResponseV1DeleteUserById> => {
  const CONTEXT_USER_ID = context?.user?.id;
  const COLLECTION_OPTIONS = {
    readPreference: ReadPreference.SECONDARY_PREFERRED
  }

  let filter;
  try {
    if (
      lodash.isEmpty(params?.id)
    ) {
      const MESSAGE = `Missing required params.id parameter!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }
    if (
      !validator.isMongoId(params?.id) &&
      !validator.isAlphanumeric(params?.id, 'en-US', { ignore: '_-@.' })
    ) {
      const ERROR_MESSAGE = 'Invalid params.id attribute!';
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, ERROR_MESSAGE);
    }

    filter = {
      _id: params?.id,
    }

    const MONGO_CLIENT = await datasource._getMongoClient();
    const RET_VAL = await MONGO_CLIENT
      .__findOneAndDelete(
        context,
        {
          collection: datasource._collections.users,
          collectionOptions: COLLECTION_OPTIONS,
          filter: filter
        }
      );

    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, { CONTEXT_USER_ID, params });
    logger.error(deleteOneById.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}
