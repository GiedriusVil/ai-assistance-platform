/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-ai-services-datasource-provider-datasource-mongo-ai-service-tests-delete-one-by-id';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import {
  ReadPreference,
} from 'mongodb';

import lodash from '@ibm-aca/aca-wrapper-lodash';

import {
  ACA_ERROR_TYPE,
  formatIntoAcaError,
  appendDataToError,
  throwAcaError,
} from '@ibm-aca/aca-utils-errors';

import {
  IContextV1,
} from '@ibm-aiap/aiap--types-server';

import {
  IDeleteAiServiceTestByIdParamsV1,
  IDeleteAiServiceTestByIdResponseV1,
} from '../../types';

import {
  AiServicesDatasourceMongoV1,
} from '..';

export const deleteOneById = async (
  datasource: AiServicesDatasourceMongoV1,
  context: IContextV1,
  params: IDeleteAiServiceTestByIdParamsV1,
): Promise<IDeleteAiServiceTestByIdResponseV1> => {

  const CONTEXT_USER_ID = context?.user?.id;
  const COLLECTION = datasource._collections.aiServiceTests;

  let id;

  let filter;
  try {
    if (
      lodash.isEmpty(params?.id)
    ) {
      const MESSAGE = `Missing mandatory params.id attribute! [ACTUAL: ${params?.id}]`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.INITIALIZATION_ERROR, MESSAGE);
    }
    id = params?.id;

    const COLLECTION_OPTIONS = {
      readPreference: ReadPreference.SECONDARY_PREFERRED
    };
    filter = {
      _id: id,
    };
    const MONGO_CLIENT = await datasource._getMongoClient();
    const RET_VAL = await MONGO_CLIENT
      .__deleteOne(context, {
        collection: COLLECTION,
        collectionOptions: COLLECTION_OPTIONS,
        filter: filter
      });

    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, { CONTEXT_USER_ID, params, filter });
    logger.error(deleteOneById.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}
