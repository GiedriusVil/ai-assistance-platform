/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-conv-shadow-datasource-conversations-save-one';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import lodash from '@ibm-aca/aca-wrapper-lodash';
import ramda from '@ibm-aca/aca-wrapper-ramda';

import { v4 as uuidv4 } from 'uuid';

import moment from 'moment';

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
  IConversationShadowV1,
  IConversationShadowSaveOneParamsV1,
} from '../../types';

const _sanitizeBeforeSave = (
  conversation: IConversationShadowV1,
) => {
  delete conversation.id;
};

const updateDuration = (
  conversation:IConversationShadowV1
) => {
  conversation.duration = moment(conversation.end).diff(moment(conversation.start), 'milliseconds');
};

const saveOne = async (
  datasource: ConversationsShadowDatasourceMongoV1,
  context: IContextV1,
  params: IConversationShadowSaveOneParamsV1
): Promise<IConversationShadowV1> => {

  const CONTEXT_USER_ID = context.user?.id;
  const COLLECTION = datasource._collections.conversations;

  let filter;

  let value;
  let valueId;

  let updateCondition;
  let updateOptions;
  try {
    if (
      lodash.isEmpty(params?.value)
    ) {
      const MESSAGE = `Missing required params.value attribute!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }
    value = params.value;
    valueId = value.id ? value.id : uuidv4();
    filter = {
      _id: valueId
    };
    const MONGO_CLIENT = await datasource._getMongoClient();
    const FOUND_CONVERSATION_RESULT = await MONGO_CLIENT
    .__findToArray(context, {
      collection: COLLECTION,
      filter: filter,
    });
    const FOUND_CONVERSATION = ramda.pathOr({}, [0], FOUND_CONVERSATION_RESULT);
    
  if (
    !lodash.isEmpty(FOUND_CONVERSATION) &&
    !lodash.isEmpty(value)
  ) {
    let incomingInteraction = ramda.pathOr(false, ['hasUserInteraction'], value);
    let currentInteraction = ramda.pathOr(false, ['hasUserInteraction'], FOUND_CONVERSATION);
    value.hasUserInteraction = currentInteraction || incomingInteraction;
  }

    _sanitizeBeforeSave(value);

    if (
      !lodash.isEmpty(FOUND_CONVERSATION)
    ) {
      value.start = FOUND_CONVERSATION.start;
      updateDuration(value);
    }

    updateCondition = {
      $set: value
    };
    updateOptions = {
      upsert: true,
      ...params?.options,
    };


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
    appendDataToError(ACA_ERROR, {
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
