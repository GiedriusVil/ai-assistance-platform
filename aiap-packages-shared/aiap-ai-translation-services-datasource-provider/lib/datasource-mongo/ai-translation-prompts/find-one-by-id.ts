/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-ai-translation-services-datasource-mongo-ai-translation-prompts-find-one-by-id';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import ramda from '@ibm-aca/aca-wrapper-ramda';
import lodash from '@ibm-aca/aca-wrapper-lodash';

import { 
  ReadPreference 
} from 'mongodb';

import { 
  formatIntoAcaError, 
  throwAcaError, 
  appendDataToError, 
  ACA_ERROR_TYPE 
} from '@ibm-aca/aca-utils-errors';

import { 
  sanitizeIdAttribute 
} from '@ibm-aiap/aiap-utils-mongo';

import {
  IContextV1
} from '@ibm-aiap/aiap--types-server';

import {
  AiTranslationServicesDatasourceMongoV1
} from '..';

import {
  IAiTranslationPromptsFindOneByIdParamsV1,
  IAiTranslationPromptsFindOneByIdResponseV1
} from '../../types';


const findOneById = async (
  datasource: AiTranslationServicesDatasourceMongoV1,
  context: IContextV1,
  params: IAiTranslationPromptsFindOneByIdParamsV1,
): Promise<IAiTranslationPromptsFindOneByIdResponseV1> => {
  const CONTEXT_USER_ID = context?.user?.id;
  const AI_TRANSLATION_PROMPT_ID = params?.id;
  const COLLECTION = datasource._collections.aiTranslationPrompts;

  let filter;
  try {
    if (
      lodash.isEmpty(AI_TRANSLATION_PROMPT_ID)
    ) {
      const MESSAGE = `Missing required params.id parameter!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }
    const COLLECTION_OPTIONS = {
      readPreference: ReadPreference.SECONDARY_PREFERRED
    };
    filter = {
      _id: AI_TRANSLATION_PROMPT_ID
    };

    const MONGO_CLIENT = await datasource._getMongoClient();
    const RESPONSE = await MONGO_CLIENT
      .__findToArray(context, {
        collection: COLLECTION,
        collectionOptions: COLLECTION_OPTIONS,
        filter: filter
      });

    const RET_VAL: IAiTranslationPromptsFindOneByIdResponseV1 = ramda.pathOr({}, [0], RESPONSE);
    sanitizeIdAttribute(RET_VAL);
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, { USER_ID: CONTEXT_USER_ID, AI_SERVICE_ID: AI_TRANSLATION_PROMPT_ID, filter });
    logger.error(findOneById.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

export {
  findOneById
}
