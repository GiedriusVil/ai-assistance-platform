
/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'app-datasource-mongo-tenants-save-one';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const validator = require('validator');

import lodash from '@ibm-aca/aca-wrapper-lodash';

import {
  uuidv4,
} from '@ibm-aca/aca-wrapper-uuid';

import {
  IContextV1,
} from '@ibm-aiap/aiap--types-server';

import {
  IParamsV1SaveTenant,
} from '@ibm-aiap/aiap--types-domain-app';

import {
  ACA_ERROR_TYPE,
  formatIntoAcaError,
  appendDataToError,
  throwAcaError,
} from '@ibm-aca/aca-utils-errors';

import {
  encryptObjectStorageApiAccessSecret,
} from '../utils';

import {
  DatasourceAppV1Mongo,
} from '..';

import {
  findOneById,
} from './find-one-by-id';

export const saveOne = async (
  datasource: DatasourceAppV1Mongo,
  context: IContextV1,
  params: IParamsV1SaveTenant,
) => {
  const CONTEXT_USER_ID = context?.user?.id;

  let value;
  let valueId;

  let filter = {};
  let update;
  let options;
  try {
    if (
      lodash.isEmpty(params?.value)
    ) {
      const ERROR_MESSAGE = `Required parameter params.value is missing!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, ERROR_MESSAGE);
    }
    value = params?.value;
    valueId = lodash.isEmpty(value?.id) ? uuidv4() : value?.id;

    if (
      !validator.isUUID(valueId) &&
      !validator.isAlphanumeric(valueId, 'en-US', { ignore: '_-' })
    ) {
      const ERROR_MESSAGE = `Tenant id is invalid!`
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, ERROR_MESSAGE);
    }

    filter = { _id: { $eq: valueId } };

    delete value?.id;

    update = { $set: value };
    options = { upsert: true };

    encryptObjectStorageApiAccessSecret(datasource.configuration.encryptionKey, value)

    const MONGO_CLIENT = await datasource._getMongoClient();
    await MONGO_CLIENT
      .__updateOne(context,
        {
          collection: datasource._collections.tenants,
          filter: filter,
          update: update,
          options: options,
        });

    const RET_VAL = await findOneById(datasource, context, { id: valueId });
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, { CONTEXT_USER_ID, filter, update, options });
    logger.error(saveOne.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}
