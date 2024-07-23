
/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-conv-shadow-datasource-messages-save-one';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import lodash from '@ibm-aca/aca-wrapper-lodash';

import { v4 as uuidv4 } from 'uuid';

import {
  appendDataToError,
  formatIntoAcaError,
  throwAcaError,
  ACA_ERROR_TYPE
} from '@ibm-aca/aca-utils-errors';

import {
  IContextV1,
} from '@ibm-aiap/aiap--types-server';

import {
  ConversationsShadowDatasourceMongoV1,
} from '../index';

import {
  IMessageShadowV1,
  IMessageShadowSaveOneParamsV1,
} from '../../types';

const _sanitizeBeforeSave = (
  message: IMessageShadowV1
) => {
  delete message.id;
}

const saveOne = async (
  datasource: ConversationsShadowDatasourceMongoV1,
  context: IContextV1,
  params: IMessageShadowSaveOneParamsV1,
): Promise<IMessageShadowV1> => {

  const CONTEXT_USER_ID = context?.user?.id;
  const COLLECTION = datasource._collections.messages;

  let filter;

  let value;
  let valueId;

  let updateCondition;
  let updateOptions;
  try {
    if (
      lodash.isEmpty(params?.value)
    ) {
      const MESSAGE = `Missing required params.message attribute!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }
    value = params.value;
    valueId = value.id ? value.id : uuidv4();
    filter = {
      _id: valueId,
    };

    _sanitizeBeforeSave(value);

    updateCondition = {
      $set: value
    };
    updateOptions = {
      upsert: true,
      ...params?.options,
    }

    const MONGO_CLIENT = await datasource._getMongoClient();
    await MONGO_CLIENT
      .__updateOne(context,
        {
          collection: COLLECTION,
          filter: filter,
          update: updateCondition,
          options: updateOptions,
        });

    value.id = valueId;
    return value;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR,
      {
        CONTEXT_USER_ID,
        filter,
        updateCondition,
      });

    logger.error(saveOne.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

export {
  saveOne,
}
