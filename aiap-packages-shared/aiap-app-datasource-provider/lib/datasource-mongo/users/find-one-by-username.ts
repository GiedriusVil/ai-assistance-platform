/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'app-datasource-mongo-users-find-one-by-username';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import {
  ReadPreference,
} from 'mongodb';

import ramda from '@ibm-aca/aca-wrapper-ramda';
import lodash from '@ibm-aca/aca-wrapper-lodash';

import {
  IContextV1,
} from '@ibm-aiap/aiap--types-server';

import {
  IParamsV1FindUserByUsername,
} from '@ibm-aiap/aiap--types-domain-app';

import {
  ACA_ERROR_TYPE,
  appendDataToError,
  formatIntoAcaError,
  throwAcaError,
} from '@ibm-aca/aca-utils-errors'

import {
  sanitizeIdAttribute,
} from '@ibm-aiap/aiap-utils-mongo';

import {
  DatasourceAppV1Mongo,
} from '..';

export const findOneByUserName = async (
  datasource: DatasourceAppV1Mongo,
  context: IContextV1,
  params: IParamsV1FindUserByUsername,
) => {
  const CONTEXT_USER_ID = context?.user?.id;

  let filter;

  try {
    if (
      lodash.isEmpty(params?.username)
    ) {
      const ERROR_MESSAGE = 'Missing params.username required parameter!';
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, ERROR_MESSAGE);
    }

    filter = {
      username: params?.username,
    }

    const COLLECTION_OPTIONS = {
      readPreference: ReadPreference.SECONDARY_PREFERRED,
    }

    const MONGO_CLIENT = await datasource._getMongoClient();
    const RESPONSE = await MONGO_CLIENT
      .__findToArray(context, {
        collection: datasource._collections.users,
        collectionOptions: COLLECTION_OPTIONS,
        filter: filter,
      });

    const RET_VAL = ramda.pathOr({}, [0], RESPONSE);
    sanitizeIdAttribute(RET_VAL);
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, { CONTEXT_USER_ID, filter });
    logger.error(findOneByUserName.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}
