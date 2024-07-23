/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'app-datasource-mongo-tenants-find-one-by-id';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const validator = require('validator');

import {
  ReadPreference,
} from 'mongodb';

import ramda from '@ibm-aca/aca-wrapper-ramda';
import lodash from '@ibm-aca/aca-wrapper-lodash';

import {
  IContextV1,
} from '@ibm-aiap/aiap--types-server';

import {
  IParamsV1FindTenantById,
} from '@ibm-aiap/aiap--types-domain-app';

import {
  ACA_ERROR_TYPE,
  appendDataToError,
  formatIntoAcaError,
  throwAcaError,
} from '@ibm-aca/aca-utils-errors';

import {
  sanitizeIdAttribute,
} from '@ibm-aiap/aiap-utils-mongo';

import {
  DatasourceAppV1Mongo,
} from '..';

import {
  decryptObjectStorageApiAccessSecret,
} from '../utils';

export const findOneById = async (
  datasource: DatasourceAppV1Mongo,
  context: IContextV1,
  params: IParamsV1FindTenantById,
) => {
  const CONTEXT_USER_ID = context?.user?.id;
  const COLLECTION_OPTIONS = { readPreference: ReadPreference.SECONDARY_PREFERRED }

  let filter;
  try {
    if (
      lodash.isEmpty(params?.id)
    ) {
      const MESSAGE = 'Missing params.id required parameter!'
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }
    if (
      !validator.isMongoId(params?.id) &&
      !validator.isAlphanumeric(params?.id, 'en-US', { ignore: '_-' })
    ) {
      const ERROR_MESSAGE = `Required params.id parameter is invalid!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, ERROR_MESSAGE);
    }
    filter = {
      _id: {
        $eq: params?.id,
      }
    }

    const MONGO_CLIENT = await datasource._getMongoClient();
    const RESPONSE = await MONGO_CLIENT
      .__findToArray(context, {
        collection: datasource._collections.tenants,
        collectionOptions: COLLECTION_OPTIONS,
        filter: filter,
      });

    const RET_VAL = ramda.pathOr({}, [0], RESPONSE);

    decryptObjectStorageApiAccessSecret(datasource.configuration.encryptionKey, RET_VAL);

    sanitizeIdAttribute(RET_VAL);
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, { CONTEXT_USER_ID, params, filter });
    logger.error(findOneById.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}
