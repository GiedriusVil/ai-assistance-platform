/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'ai-translation-services-datasource-mongo-ai-translation-models-save-one';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import lodash from '@ibm-aca/aca-wrapper-lodash';

import { 
  v4 as uuidv4 
} from 'uuid';

import { 
  formatIntoAcaError, 
  throwAcaError, 
  appendDataToError, 
  ACA_ERROR_TYPE 
} from '@ibm-aca/aca-utils-errors';

import {
  IContextV1
} from '@ibm-aiap/aiap--types-server';

import {
  AiTranslationServicesDatasourceMongoV1
} from '..';

import {
  IAiTranslationModelsSaveOneParamsV1,
  IAiTranslationModelsSaveOneResponseV1
} from '../../types';

import { 
  findOneById 
} from './find-one-by-id';

const saveOne = async (
  datasource: AiTranslationServicesDatasourceMongoV1,
  context: IContextV1,
  params: IAiTranslationModelsSaveOneParamsV1,
): Promise<IAiTranslationModelsSaveOneResponseV1> => {
  const CONTEXT_USER = context?.user;
  const CONTEXT_USER_ID = CONTEXT_USER?.id;
  const AI_TRANSLATION_MODEL = params?.value;
  const AI_TRANSLATION_MODEL_ID = AI_TRANSLATION_MODEL?.id || uuidv4();
  const COLLECTION = datasource._collections.aiTranslationModels;

  let filter;
  try {
    if (
      lodash.isEmpty(AI_TRANSLATION_MODEL)
    ) {
      const MESSAGE = `Missing required params.aiTranslationModel paramater!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }

    delete AI_TRANSLATION_MODEL.id;
    filter = { _id: AI_TRANSLATION_MODEL_ID };
    const UPDATE_SET_CONDITION = { $set: AI_TRANSLATION_MODEL };
    const UPDATE_OPTIONS = { upsert: true };

    const MONGO_CLIENT = await datasource._getMongoClient();
     await MONGO_CLIENT
      .__updateOne(context,
        {
          collection: COLLECTION,
          filter: filter,
          update: UPDATE_SET_CONDITION,
          options: UPDATE_OPTIONS
        });

    const RET_VAL: IAiTranslationModelsSaveOneResponseV1 =
      await findOneById(datasource, context, { id: AI_TRANSLATION_MODEL_ID });
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, { USER_ID: CONTEXT_USER_ID, AI_SERVICE_ID: AI_TRANSLATION_MODEL_ID, filter });
    logger.error(saveOne.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

export {
  saveOne,
};
