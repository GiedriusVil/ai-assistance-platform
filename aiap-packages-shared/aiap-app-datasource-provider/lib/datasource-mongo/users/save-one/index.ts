/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'app-datasource-mongo-users-save-one';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const validator = require('validator');

import lodash from '@ibm-aca/aca-wrapper-lodash';

import {
  IContextV1,
} from '@ibm-aiap/aiap--types-server';

import {
  // types
  IUserV1,
  // api
  IParamsV1SaveUser,
} from '@ibm-aiap/aiap--types-domain-app';

import {
  ACA_ERROR_TYPE,
  appendDataToError,
  formatIntoAcaError,
  throwAcaError,
} from '@ibm-aca/aca-utils-errors';

import {
  findOneById,
} from '../find-one-by-id';

import {
  sanitizeOne,
} from './sanitize-one';

import {
  DatasourceAppV1Mongo,
} from '../..';

export const saveOne = async (
  datasource: DatasourceAppV1Mongo,
  context: IContextV1,
  params: IParamsV1SaveUser,
): Promise<IUserV1> => {
  const CONTEXT_USER_ID = context?.user?.id;

  let valueId;
  let value: IUserV1;

  let filter = {};
  let update;
  let options;
  try {
    value = params?.value;
    valueId = lodash.isEmpty(value?.id) ? value?.username : value?.id;

    if (
      lodash.isEmpty(value?.username)
    ) {
      const MESSAGE = `Missing required params.user.username paarameter!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }
    if (
      !validator.isUUID(valueId) &&
      !validator.isAlphanumeric(valueId, 'en-US', { ignore: '_-@.' })
    ) {
      const ERROR_MESSAGE = `User id is invalid!`
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, ERROR_MESSAGE);
    }

    filter = {
      _id: {
        $eq: valueId,
      }
    };

    sanitizeOne(value);

    update = {
      $set: value,
    };

    options = {
      upsert: true,
    };

    const MONGO_CLIENT = await datasource._getMongoClient();
    await MONGO_CLIENT
      .__updateOne(
        context,
        {
          collection: datasource._collections.users,
          filter: filter,
          update: update,
          options: options,
        }
      );

    const RET_VAL = await findOneById(datasource, context, { id: valueId });
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, { CONTEXT_USER_ID, filter, update, options });
    logger.error(saveOne.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}
