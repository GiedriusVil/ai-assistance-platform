/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'ai-translation-services-datasource-mongo-ai-translation-services-save-one';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import lodash from '@ibm-aca/aca-wrapper-lodash';

import {
  uuidv4
} from '@ibm-aca/aca-wrapper-uuid';

import {
  formatIntoAcaError,
  appendDataToError,
  throwAcaError,
  ACA_ERROR_TYPE,
} from '@ibm-aca/aca-utils-errors';

import {
  IContextV1,
} from '@ibm-aiap/aiap--types-server';

import {
  AiTranslationServicesDatasourceMongoV1
} from '..';

import {
  IAiTranslationServicesSaveOneParamsV1,
  IAiTranslationServicesSaveOneResponseV1
} from '../../types';

import {
  findOneById
} from './find-one-by-id';

import {
  encryptAiTranslationServicePassword
} from '../utils';


const saveOne = async (
  datasource: AiTranslationServicesDatasourceMongoV1,
  context: IContextV1,
  params: IAiTranslationServicesSaveOneParamsV1,
): Promise<IAiTranslationServicesSaveOneResponseV1> => {
  const CONTEXT_USER_ID = context?.user?.id;
  const VALUE = params?.value;
  const VALUE_ID = VALUE?.id || uuidv4();
  const COLLECTION = datasource._collections.aiTranslationServices;
  
  let filter;
  try {
    if (
      lodash.isEmpty(VALUE)
    ) {
      const MESSAGE = `Missing required params.aiTranslatonService paramater!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }

    delete VALUE.id;
    filter = { _id: VALUE_ID };
    const UPDATE_SET_CONDITION = { $set: VALUE };
    const UPDATE_OPTIONS = { upsert: true };

    encryptAiTranslationServicePassword(datasource.configuration.encryptionKey, VALUE);

    const MONGO_CLIENT = await datasource._getMongoClient();
    await MONGO_CLIENT
      .__updateOne(context,
        {
          collection: COLLECTION,
          filter: filter,
          update: UPDATE_SET_CONDITION,
          options: UPDATE_OPTIONS
        });

    const RET_VAL: IAiTranslationServicesSaveOneResponseV1 =
      await findOneById(datasource, context, { id: VALUE_ID });
    
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, { USER_ID: CONTEXT_USER_ID, AI_SERVICE_ID: VALUE_ID, filter });
    logger.error(saveOne.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

export {
  saveOne,
};
