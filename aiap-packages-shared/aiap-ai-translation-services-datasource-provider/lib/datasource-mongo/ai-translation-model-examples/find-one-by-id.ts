/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-ai-translation-services-datasource-mongo-ai-translation-model-examples-find-one-by-id';
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
  IAiTranslationModelExamplesFindOneByIdParamsV1,
  IAiTranslationModelExamplesFindOneByIdResponseV1
} from '../../types';

import {
  AiTranslationServicesDatasourceMongoV1
} from '..';


const findOneById = async (
  datasource: AiTranslationServicesDatasourceMongoV1,
  context: IContextV1,
  params: IAiTranslationModelExamplesFindOneByIdParamsV1,
): Promise<IAiTranslationModelExamplesFindOneByIdResponseV1> => {
  const CONTEXT_USER_ID = context?.user?.id;
  const AI_TRANSLATION_MODEL_EXAMPLE_ID = params?.id;
  const COLLECTION = datasource._collections.aiTranslationModelExamples;

  let filter;
  try {
    if (
      lodash.isEmpty(AI_TRANSLATION_MODEL_EXAMPLE_ID)
    ) {
      const MESSAGE = `Missing required params.id parameter!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }
    const COLLECTION_OPTIONS = {
      readPreference: ReadPreference.SECONDARY_PREFERRED
    };
    filter = {
      _id: AI_TRANSLATION_MODEL_EXAMPLE_ID
    };

    const MONGO_CLIENT = await datasource._getMongoClient();
    const RESPONSE = await MONGO_CLIENT
      .__findToArray(context, {
        collection: COLLECTION,
        collectionOptions: COLLECTION_OPTIONS,
        filter: filter
      });

    const RET_VAL = ramda.pathOr({}, [0], RESPONSE);
    sanitizeIdAttribute(RET_VAL);
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, { USER_ID: CONTEXT_USER_ID, AI_TRANSLATION_MODEL_EXAMPLE_ID, filter });
    logger.error(findOneById.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

export {
  findOneById
}
