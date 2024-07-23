
/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'ai-services-datasource-provider-datasource-mongo-ai-change-request-save-one';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const validator = require('validator');

import lodash from '@ibm-aca/aca-wrapper-lodash';

import {
  uuidv4,
} from '@ibm-aca/aca-wrapper-uuid';

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
  ISaveAiServiceChangeRequestParamsV1,
} from '../../types';

import {
  AiServicesDatasourceMongoV1,
} from '..';

import {
  findOneById,
} from './find-one-by-id';


export const saveOne = async (
  datasource: AiServicesDatasourceMongoV1,
  context: IContextV1,
  params: ISaveAiServiceChangeRequestParamsV1,
): Promise<any> => {
  const CONTEXT_USER_ID = context?.user?.id;
  const COLLECTION = datasource._collections.aiServicesChangeRequest;

  let value;
  let valueId;

  let filter;
  try {
    value = params?.value;
    if (
      lodash.isEmpty(value)
    ) {
      const MESSAGE = `Missing required params.value paramater!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }
    if (
      lodash.isEmpty(value?.aiService?.id)
    ) {
      const MESSAGE = `Missing required params?.value?.aiService?.id paramater!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }
    if (
      lodash.isEmpty(value?.aiService?.aiSkill?.id)
    ) {
      const MESSAGE = `Missing required params?.value?.aiService?.aiSkill?.id paramater!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }


    valueId = value?.id ? value?.id : uuidv4();

    if (
      !validator.isMongoId(valueId) &&
      !validator.isAlphanumeric(valueId, 'en-US', { ignore: '_-' })
    ) {
      const ERROR_MESSAGE = `Wrong type params.value.id parameter! [Expected - MongoId]`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, ERROR_MESSAGE);
    }

    delete value.id;
    delete value.utteranceId;
    filter = {
      _id: {
        $eq: valueId,
      }
    };
    const UPDATE_SET_CONDITION = { $set: value };
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

    const RET_VAL = await findOneById(datasource, context, { id: valueId });
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, { CONTEXT_USER_ID, filter, valueId });
    logger.error(saveOne.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}
