/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-ai-services-datasource-provider-datasource-mongo-ai-service-tests-save-one';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import {
  formatIntoAcaError,
  appendDataToError,
} from '@ibm-aca/aca-utils-errors';

import {
  IContextV1,
  IAiServiceTestV1,
} from '@ibm-aiap/aiap--types-server';

import {
  ISaveAiServiceTestParamsV1,
} from '../../types';

import {
  AiServicesDatasourceMongoV1,
} from '..';

export const saveOne = async (
  datasource: AiServicesDatasourceMongoV1,
  context: IContextV1,
  params: ISaveAiServiceTestParamsV1,
): Promise<IAiServiceTestV1> => {

  const CONTEXT_USER_ID = context?.user?.id;
  const COLLECTION = datasource._collections.aiServiceTests;

  let value: IAiServiceTestV1;
  let valueId: any;

  let filter;
  try {
    value = params?.value;
    valueId = params?.value?.id;

    filter = {
      _id: valueId
    };

    const UPDATE_SET_CONDITION = {
      $set: value,
    };
    const UPDATE_OPTIONS = {
      upsert: true
    };

    const MONGO_CLIENT = await datasource._getMongoClient();
    await MONGO_CLIENT
      .__updateOne(context,
        {
          collection: COLLECTION,
          filter: filter,
          update: UPDATE_SET_CONDITION,
          options: UPDATE_OPTIONS
        });

    return value;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, { CONTEXT_USER_ID, filter });
    logger.error(saveOne.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

