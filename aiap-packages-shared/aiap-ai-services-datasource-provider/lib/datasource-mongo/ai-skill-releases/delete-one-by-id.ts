/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-ai-services-datasource-provider-datasource-mongo-ai-skill-releases-delete-one-by-id';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import {
  ReadPreference,
} from 'mongodb';

import {
  IContextV1,
} from '@ibm-aiap/aiap--types-server';

import {
  formatIntoAcaError,
  appendDataToError,
} from '@ibm-aca/aca-utils-errors';

import {
  IDeleteAiSkillReleaseByIdParamsV1,
  IDeleteAiSkillReleaseByIdResponseV1,
} from '../../types';

import {
  AiServicesDatasourceMongoV1,
} from '..';

export const deleteOneById = async (
  datasource: AiServicesDatasourceMongoV1,
  context: IContextV1,
  params: IDeleteAiSkillReleaseByIdParamsV1,
): Promise<IDeleteAiSkillReleaseByIdResponseV1> => {
  const CONTEXT_USER_ID = context?.user?.id;
  const COLLECTION = datasource._collections.aiSkillReleases;
  const COLLECTION_OPTIONS = { readPreference: ReadPreference.PRIMARY };

  let id;

  let filter;
  try {
    id = params?.id;

    filter = {
      _id: id,
    };

    const MONGO_CLIENT = await datasource._getMongoClient();
    const RET_VAL = await MONGO_CLIENT
      .__deleteOne(context,
        {
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
