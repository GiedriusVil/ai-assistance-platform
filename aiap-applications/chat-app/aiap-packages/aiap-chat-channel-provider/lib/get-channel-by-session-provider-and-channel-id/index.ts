/*
   © Copyright IBM Corporation 2022. All Rights Reserved 
    
   SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = `aiap-chat-channel-provider-get-channel-by-session-provider-and-channel-id`;
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import lodash from '@ibm-aca/aca-wrapper-lodash';

import {
  throwAcaError,
  ACA_ERROR_TYPE,
  formatIntoAcaError,
  appendDataToError,
} from '@ibm-aca/aca-utils-errors';

// import { getConfiguration } from '@ibm-aiap/aiap-env-configuration-service'

// const CONFIGURATION = getConfiguration();

import {
  ChatChannelV1,
  IChatChannelV1Configuration,
} from '@ibm-aiap/aiap-chat-app--types';

import { ChatChannelV1Socketio } from '@ibm-aiap/aiap-chat-channel-socketio';
// import { ChatChannelV1Genesys } from '@ibm-aiap/aiap-chat-channel-genesys';

import { ChatChannelV1GenesysCohV2 } from '@ibm-aiap/aiap-chat-channel-genesys-coh-provider';
import { ChatChannelV1TeliaAce } from '@ibm-aiap/aiap-chat-channel-telia-ace-provider';
import { ChatChannelV1Rocketchat } from '@ibm-aiap/aiap-chat-channel-rocketchat-provider';

import {
  setChannelToRegistry,
  getChannelFromRegistry,
} from '../registry';

// const CONFIGURATION_CHANNEL_SOCKETIO = CONFIGURATION?.channel?.socketio;
// const CONFIGURATION_CHANNEL_GENESYS = CONFIGURATION?.channel?.genesys;

const getChannelBySessionProviderAndChannelId = (
  chatServerSessionProvider: any,
  channelId: string,
): ChatChannelV1<IChatChannelV1Configuration> => {
  let conversationId: string;
  let engagementChatServerChannels;

  let channelConfiguration;
  let channelConfigurationType;

  let retVal: ChatChannelV1<IChatChannelV1Configuration>;
  try {
    if (
      lodash.isEmpty(channelId)
    ) {
      const ERROR_MESSAGE = `Missing required channelId parameter!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, ERROR_MESSAGE);
    }
    if (
      !lodash.isString(channelId)
    ) {
      const ERROR_MESSAGE = `Wrong type of channelId parameter! [Required: String]`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, ERROR_MESSAGE);
    }
    if (
      lodash.isEmpty(chatServerSessionProvider?.session?.conversation?.id)
    ) {
      const ERROR_MESSAGE = `Missing required chatServerSessionProvider?.session?.conversation?.id parameter!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, ERROR_MESSAGE);
    }
    conversationId = chatServerSessionProvider?.session?.conversation?.id;

    if (
      lodash.isEmpty(chatServerSessionProvider?.session?.engagement?.chatAppServer?.channels)
    ) {
      const ERROR_MESSAGE = `Missing required chatServerSessionProvider?.session?.engagement?.chatAppServer?.channels attribute!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, ERROR_MESSAGE);
    }
    if (
      !lodash.isObject(chatServerSessionProvider?.session?.engagement?.chatAppServer?.channels)
    ) {
      const ERROR_MESSAGE = `Wrong type of chatServerSessionProvider?.session?.engagement?.chatAppServer?.channels attribute! [Required: Object]`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, ERROR_MESSAGE);
    }

    engagementChatServerChannels = chatServerSessionProvider?.session?.engagement?.chatAppServer?.channels;
    channelConfiguration = engagementChatServerChannels[channelId];
    channelConfigurationType = channelConfiguration?.type;

    if (
      lodash.isEmpty(channelConfigurationType)
    ) {
      const ERROR_MESSAGE = `Missing sessionProvider?.session?.engagement?.chatAppServer?.channels[channelId]?.type attribute!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, ERROR_MESSAGE);
    }

    // retVal = getChannelFromRegistry({
    //   conversationId,
    //   channelId,
    // });

    if (
      retVal
    ) {
      retVal.setChatServerSessionProvider(chatServerSessionProvider);
    } else {
      switch (channelConfigurationType.toUpperCase()) {
        case 'SOCKETIO':
          retVal = new ChatChannelV1Socketio(
            channelId,
            chatServerSessionProvider,
            channelConfiguration,
          );
          break;
        // case 'GENESYS':
        //   retVal = new ChatChannelV1Genesys(chatServerSessionProvider, CONFIGURATION_CHANNEL_GENESYS);
        //   break;
        case 'GENESYS_COH_V2':
          retVal = new ChatChannelV1GenesysCohV2(
            channelId,
            chatServerSessionProvider,
            channelConfiguration,
          );
          break;
        case 'TELIAACE':
          retVal = new ChatChannelV1TeliaAce(
            channelId,
            chatServerSessionProvider,
            channelConfiguration,
          );
          break;
        case 'ROCKETCHAT':
          retVal = new ChatChannelV1Rocketchat(
            channelId,
            chatServerSessionProvider,
            channelConfiguration
          );
          break;
        default:
          throw new Error('Unsupported channel type!');
          break;
      }
      setChannelToRegistry(
        {
          conversationId: conversationId,
          channelId: channelId,
          channel: retVal
        }
      );
    }

    return retVal;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, {
      channelId,
      channelConfigurationType,
    });
    logger.error(getChannelBySessionProviderAndChannelId.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
};

export {
  getChannelBySessionProviderAndChannelId,
};
