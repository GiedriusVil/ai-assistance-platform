/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'app-datasource-mongo-access-groups-delete-one-by-id';
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
  IParamsV1DeleteAccessGroupById,
  IResponseV1DeleteAccessGroupById,
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
  params: IParamsV1DeleteAccessGroupById,
): Promise<IResponseV1DeleteAccessGroupById> => {
  const CONTEXT_USER_ID = context?.user?.id;
  const PARAMS_ID = params?.id;
  const COLLECTION_OPTIONS = {
    readPreference: ReadPreference.SECONDARY_PREFERRED
  };
  let filter;
  try {
    if (
      lodash.isEmpty(PARAMS_ID)
    ) {
      const ERROR_MESSAGE = `Required parameter params.id is missing!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, ERROR_MESSAGE);
    }
    if (
      !validator.isMongoId(PARAMS_ID) &&
      !validator.isAlphanumeric(PARAMS_ID, 'en-US', { ignore: '_-' })
    ) {
      const ERROR_MESSAGE = `Required parameter params.id is invalid!`
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, ERROR_MESSAGE);
    }

    filter = {
      _id: PARAMS_ID,
    };

    const MONGO_CLIENT = await datasource._getMongoClient();
    const RET_VAL = await MONGO_CLIENT
      .__deleteOne(context, {
        collection: datasource._collections.accessGroups,
        collectionOptions: COLLECTION_OPTIONS,
        filter: filter
      });

    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, { CONTEXT_USER_ID, PARAMS_ID });
    logger.error(deleteOneById.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}
