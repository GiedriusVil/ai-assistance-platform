/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-ai-services-datasource-provider-datasource-mongo-ai-services-delete-many-by-ids';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import { ReadPreference } from 'mongodb';

import lodash from '@ibm-aca/aca-wrapper-lodash';

import {
  ACA_ERROR_TYPE,
  formatIntoAcaError,
  throwAcaError,
  appendDataToError,
} from '@ibm-aca/aca-utils-errors';

import {
  IContextV1,
} from '@ibm-aiap/aiap--types-server';

import {
  IDeleteAiServicesByIdsParamsV1,
  IDeleteAiServicesByIdsResponseV1,
} from '../../types/params/ai-services';

import {
  AiServicesDatasourceMongoV1,
} from '..';

export const deleteManyByIds = async (
  datasource: AiServicesDatasourceMongoV1,
  context: IContextV1,
  params: IDeleteAiServicesByIdsParamsV1,
): Promise<IDeleteAiServicesByIdsResponseV1> => {
  const CONTEXT_USER_ID = context?.user?.id;

  const COLLECTION = datasource._collections.aiServices;
  const COLLECTION_OPTIONS = { readPreference: ReadPreference.PRIMARY };

  let ids;

  let filter;
  try {
    if (
      lodash.isEmpty(params?.ids)
    ) {
      const MESSAGE = `Missing required params.ids parameter!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }
    ids = params?.ids;

    filter = {
      _id: {
        $in: ids,
      }
    };

    const MONGO_CLIENT = await datasource._getMongoClient();
    await MONGO_CLIENT
      .__deleteMany(context, {
        collection: COLLECTION,
        collectionOptions: COLLECTION_OPTIONS,
        filter: filter
      });

    const RET_VAL = {
      ids: ids,
      status: 'SUCCESS'
    };
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, { CONTEXT_USER_ID, filter });
    logger.error(deleteManyByIds.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}
