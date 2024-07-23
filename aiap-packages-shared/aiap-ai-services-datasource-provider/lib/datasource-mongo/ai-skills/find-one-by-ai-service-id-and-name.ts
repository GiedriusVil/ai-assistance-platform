
/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'ai-services-datasource-provider-datasource-mongo-ai-skills-find-one-by-ai-service-id-and-name';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import {
  ReadPreference,
} from 'mongodb';

import lodash from '@ibm-aca/aca-wrapper-lodash';
import ramda from '@ibm-aca/aca-wrapper-ramda';

import {
  IContextV1,
  IAiSkillV1,
} from '@ibm-aiap/aiap--types-server';

import {
  ACA_ERROR_TYPE,
  formatIntoAcaError,
  throwAcaError,
  appendDataToError,
} from '@ibm-aca/aca-utils-errors';

import {
  sanitizeIdAttribute,
} from '@ibm-aiap/aiap-utils-mongo';

import {
  IFindAiSkillByAiServiceIdAndNameParamsV1,
} from '../../types';

import {
  AiServicesDatasourceMongoV1,
} from '..'

export const findOneByAiServiceIdAndName = async (
  datasource: AiServicesDatasourceMongoV1,
  context: IContextV1,
  params: IFindAiSkillByAiServiceIdAndNameParamsV1,
): Promise<IAiSkillV1> => {
  const CONTEXT_USER_ID = context?.user?.id;
  const COLLECTION = datasource._collections.aiSkills;
  const COLLECTION_OPTIONS = { readPreference: ReadPreference.SECONDARY_PREFERRED };

  let filter;
  try {
    if (
      lodash.isEmpty(params?.aiServiceId)
    ) {
      const MESSAGE = `Missing required params.aiServiceId parameter!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }
    if (
      lodash.isEmpty(params?.name)
    ) {
      const MESSAGE = `Missing required params.name parameter!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }

    filter = {
      aiServiceId: params?.aiServiceId,
      name: params?.name,
    };

    const MONGO_CLIENT = await datasource._getMongoClient();
    const RESPONSE = await MONGO_CLIENT
      .__findToArray(context,
        {
          collection: COLLECTION,
          collectionOptions: COLLECTION_OPTIONS,
          filter: filter
        });

    const RET_VAL: IAiSkillV1 = ramda.pathOr({}, [0], RESPONSE);
    sanitizeIdAttribute(RET_VAL);
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(MODULE_ID, { CONTEXT_USER_ID, filter });
    logger.error(findOneByAiServiceIdAndName.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}
