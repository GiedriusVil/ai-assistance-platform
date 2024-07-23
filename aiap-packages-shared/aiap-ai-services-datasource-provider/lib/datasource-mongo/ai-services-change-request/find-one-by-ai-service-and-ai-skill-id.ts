/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-ai-services-datasource-provider-datasource-mongo-ai-services-change-request-find-one-by-id';
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
  ACA_ERROR_TYPE,
  formatIntoAcaError,
  throwAcaError,
  appendDataToError,
} from '@ibm-aca/aca-utils-errors';

import {
  sanitizeIdAttribute,
} from '@ibm-aiap/aiap-utils-mongo';

import {
  IFindAiServiceChangeRequestByAiServiceAndAiSkillIdParamsV1,
  IFindAiServiceChangeRequestByAiServiceAndAiSkillIdResponseV1
} from '../../types'

import {
  AiServicesDatasourceMongoV1,
} from '..';

export const findOneByAiServiceAndAiSkillId = async (
  datasource: AiServicesDatasourceMongoV1,
  context: IContextV1,
  params: IFindAiServiceChangeRequestByAiServiceAndAiSkillIdParamsV1,
): Promise<IFindAiServiceChangeRequestByAiServiceAndAiSkillIdResponseV1> => {
  const CONTEXT_USER_ID = context?.user?.id;
  const COLLECTION = datasource._collections.aiServicesChangeRequest;
  const COLLECTION_OPTIONS = { readPreference: ReadPreference.SECONDARY_PREFERRED };
  const PARAMS_VALUE = params?.value;
  let aiServiceId;
  let aiSkillId;
  let filter;
  try {
    aiServiceId = PARAMS_VALUE?.aiService?.id;
    aiSkillId = PARAMS_VALUE?.aiService?.aiSkill?.id;
    if (
      lodash.isEmpty(aiServiceId)
    ) {
      const MESSAGE = `Missing required params.aiService.id attribute!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }
    if (
      lodash.isEmpty(aiSkillId)
    ) {
      const MESSAGE = `Missing required params.aiService.aiSkill.id attribute!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }

    filter = {
      'aiService.id': aiServiceId,
      'aiService.aiSkill.id': aiSkillId
    };
    const MONGO_CLIENT = await datasource._getMongoClient();
    const RESULT = await MONGO_CLIENT
      .__findToArray(context, {
        collection: COLLECTION,
        collectionOptions: COLLECTION_OPTIONS,
        filter: filter,
      });

    const RET_VAL = ramda.pathOr({}, [0], RESULT);
    sanitizeIdAttribute(RET_VAL);
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, { CONTEXT_USER_ID, params, filter });
    logger.error(findOneByAiServiceAndAiSkillId.name, { ACA_ERROR });
    throw error;
  }
}
