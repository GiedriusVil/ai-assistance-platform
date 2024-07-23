/*
  © Copyright IBM Corporation 2023. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = `aiap-chat-channel-provider-registry`;
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import lodash from '@ibm-aca/aca-wrapper-lodash';

import {
  throwAcaError,
  ACA_ERROR_TYPE,
  formatIntoAcaError,
  appendDataToError,
} from '@ibm-aca/aca-utils-errors';

import {
  ChatChannelV1,
  IChatChannelV1Configuration,
} from '@ibm-aiap/aiap-chat-app--types';

const REGISTRY: {
  [key: string]: ChatChannelV1<IChatChannelV1Configuration>,
} = {};

const _constructChannelRegistryId = (
  params: {
    conversationId: string,
    channelId: string,
  }
) => {
  try {
    if (
      lodash.isEmpty(params.conversationId)
    ) {
      const ERROR_MESSAGE = `Missing required channelId parameter!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, ERROR_MESSAGE);
    }
    if (
      lodash.isEmpty(params?.channelId)
    ) {
      const ERROR_MESSAGE = `Missing required channelId parameter!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, ERROR_MESSAGE);
    }

    const RET_VAL = `${params?.channelId}:${params?.conversationId}`;
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, { params });
    logger.error(_constructChannelRegistryId.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

const setChannelToRegistry = (
  params: {
    conversationId: string,
    channelId: string,
    channel: ChatChannelV1<IChatChannelV1Configuration>,
  }
) => {
  let channelRegistryId: string;
  try {
    channelRegistryId = _constructChannelRegistryId(params);
    if (
      !params?.channel
    ) {
      const ERROR_MESSAGE = `Missing required params?.channel attribute!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, ERROR_MESSAGE);
    }
    REGISTRY[channelRegistryId] = params?.channel;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, { channelRegistryId });
    logger.error(setChannelToRegistry.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

const getChannelFromRegistry = (
  params: {
    conversationId: string,
    channelId: string,
  }
): ChatChannelV1<IChatChannelV1Configuration> => {
  let channelRegistryId: string;
  try {
    channelRegistryId = _constructChannelRegistryId(params);
    const RET_VAL = REGISTRY[channelRegistryId];
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, { channelRegistryId });
    logger.error(setChannelToRegistry.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

export {
  setChannelToRegistry,
  getChannelFromRegistry,
}
