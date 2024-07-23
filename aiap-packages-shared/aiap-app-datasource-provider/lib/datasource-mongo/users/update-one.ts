
/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'app-datasource-mongo-users-update-one';
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
  // types
  IUserV1,
  // api
  IParamsV1UpdateUser,
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

import {
  findOneById,
} from './find-one-by-id';

export const updateOne = async (
  datasource: DatasourceAppV1Mongo,
  context: IContextV1,
  params: IParamsV1UpdateUser,
): Promise<IUserV1> => {
  const CONTEXT_USER_ID = context?.user?.id;
  const COLLECTION_OPTIONS = { readPreference: ReadPreference.SECONDARY_PREFERRED };

  let filter;
  let update;
  try {
    if (
      !validator.isUUID(params?.value?.id) &&
      !validator.isAlphanumeric(params?.value?.id, 'en-US', { ignore: '_-@.' })
    ) {
      const ERROR_MESSAGE = `Parameter user.id is invalid!`
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, ERROR_MESSAGE);
    }

    if (
      lodash.isEmpty(params?.value?.password)
    ) {
      delete params?.value?.password;
    }

    filter = {
      _id: {
        $eq: params?.value?.id,
      }
    };

    update = {
      $set: params?.value,
    };

    const MONGO_CLIENT = await datasource._getMongoClient();
    await MONGO_CLIENT
      .__findOneAndUpdate(
        context,
        {
          collection: datasource._collections.users,
          collectionOptions: COLLECTION_OPTIONS,
          filter: filter,
          update: update,
        }
      );

    const RET_VAL = await findOneById(datasource, context, { id: params?.value?.id });
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, { CONTEXT_USER_ID, filter, update });
    logger.error(updateOne.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}
