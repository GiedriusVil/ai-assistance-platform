
/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'ai-services-datasource-provider-datasource-mongo-ai-skills-delete-one-by-id';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import lodash from '@ibm-aca/aca-wrapper-lodash';

import {
  IContextV1,
} from '@ibm-aiap/aiap--types-server';

import {
  ACA_ERROR_TYPE,
  formatIntoAcaError,
  throwAcaError,
  appendDataToError,
} from '@ibm-aca/aca-utils-errors';

import {
  IDeleteAiSkillByIdParamsV1,
  IDeleteAiSkillByIdResponseV1,
} from '../../types';

import {
  AiServicesDatasourceMongoV1,
} from '..'

export const deleteOneById = async (
  datasource: AiServicesDatasourceMongoV1,
  context: IContextV1,
  params: IDeleteAiSkillByIdParamsV1,
): Promise<IDeleteAiSkillByIdResponseV1> => {
  const CONTEXT_USER_ID = context?.user?.id;
  const COLLECTION = datasource._collections.aiSkills;

  let id;

  let filter;
  try {
    if (
      lodash.isEmpty(params?.id)
    ) {
      const MESSAGE = `Missing required params.id parameter!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }
    id = params?.id

    filter = {
      _id: id,
    };

    const MONGO_CLIENT = await datasource._getMongoClient();
    await MONGO_CLIENT
      .__deleteOne(context,
        {
          collection: COLLECTION,
          filter: filter
        });

    const RET_VAL = {
      status: 'SUCCESS'
    };
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, { CONTEXT_USER_ID, params, filter });
    logger.error(deleteOneById.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}


