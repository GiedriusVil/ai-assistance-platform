/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-ai-services-datasource-provider-datasource-mongo-ai-services-changes-save-one';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const validator = require('validator');

import lodash from '@ibm-aca/aca-wrapper-lodash';

import {
  uuidv4,
} from '@ibm-aca/aca-wrapper-uuid';

import {
  IContextV1,
  IAiServiceChangesV1,
} from '@ibm-aiap/aiap--types-server';

import {
  ACA_ERROR_TYPE,
  formatIntoAcaError,
  throwAcaError,
  appendDataToError,
} from '@ibm-aca/aca-utils-errors';

import {
  ISaveAiServiceChangeParamsV1,
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
  params: ISaveAiServiceChangeParamsV1,
): Promise<IAiServiceChangesV1> => {
  const CONTEXT_USER_ID = context?.user?.id;
  const COLLECTION = datasource._collections.aiServicesChanges;

  let value;
  let valueId;

  let filter = {};
  let updateCondition;
  let updateOptions;
  try {
    if (
      lodash.isEmpty(params?.value)
    ) {
      const ERROR_MESSAGE = `Missing required params.value parameter!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, ERROR_MESSAGE);
    }
    value = params?.value;
    valueId = value?.id ? value?.id : uuidv4();

    if (
      validator.isUUID(valueId) ||
      validator.isAlphanumeric(valueId, 'en-US', { ignore: '_-' })
    ) {
      filter = { _id: { $eq: valueId } };
    } else {
      const ERROR_MESSAGE = `Parameter params?.value?.id is invalid!`
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, ERROR_MESSAGE);
    }

    delete value.id;

    updateCondition = { $set: value };
    updateOptions = { upsert: true };

    const MONGO_CLIENT = await datasource._getMongoClient();
    await MONGO_CLIENT
      .__updateOne(context,
        {
          collection: COLLECTION,
          filter: filter,
          update: updateCondition,
          options: updateOptions,
        });

    const RET_VAL: IAiServiceChangesV1 = await findOneById(datasource, context, { id: valueId });
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, { CONTEXT_USER_ID, params, filter, updateCondition });
    logger.error(saveOne.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}
