/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-chat-channel-telia-ace-provider-telia-ace-channel';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import lodash from '@ibm-aca/aca-wrapper-lodash';

import {
  formatIntoAcaError,
  appendDataToError,
  throwAcaError,
  ACA_ERROR_TYPE,
} from '@ibm-aca/aca-utils-errors';

import {
  storeSession
} from '@ibm-aca/aca-utils-session';

import {
  retrieveTranscript,
} from '@ibm-aca/aca-utils-transcript';

import { transformTranscript } from '../client-utils';

import { getEventStreamMain } from '@ibm-aiap/aiap-event-stream-provider';

import {
  IChatMessageV1,
  ChatChannelV1,
  ChatServerV1SessionProvider,
  ChatServerV1,
  IChatServerSessionV1,
} from '@ibm-aiap/aiap-chat-app--types';

import {
  IChatChannelV1TeliaAceConfiguration,
} from '../types';

import { channelClient } from '../channel-client';

import { processMessage } from '../message-processor';

class ChatChannelV1TeliaAce extends ChatChannelV1<IChatChannelV1TeliaAceConfiguration> {

  unsubscribeFromTeliaAceEvents: any;

  online: any;
  refreshTimer: any;

  constructor(
    id: string,
    chatServerSessionProvider: ChatServerV1SessionProvider<ChatServerV1, ChatChannelV1TeliaAce>,
    configuration: IChatChannelV1TeliaAceConfiguration,
  ) {
    super(id, chatServerSessionProvider, configuration);
    this.type = configuration?.type;
  }

  async startChat(session: IChatServerSessionV1) {
    const STATE: any = {};
    try {
      if (
        lodash.isEmpty(session?.conversation?.id)
      ) {
        const ERROR_MESSAGE = 'Missing required session?.conversation';
        throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, ERROR_MESSAGE);
      }
      this.conversationId = session?.conversation?.id;

      STATE.authentication = await channelClient.authenticate(
        this,
        {
          configuration: this.configuration,
        });
      
      STATE.conversation = await channelClient.postConversation(
        this,
        {
          state: STATE,
        });

      session.conversation.external = {
        id: STATE?.conversation?.properties?.uuid,
      }

      session.channel[this.id] = STATE;
      await storeSession(session);
      this.conversationIdExternal = session?.conversation?.external?.id;
      await this.subscribeForTeliaAceEvents();
      logger.info(this.startChat.name, {
        this_conversationId: this.conversationId,
        this_conversationIdExternal: this.conversationIdExternal,
      });

      logger.info(MODULE_ID, {
        STATE: STATE
      });

      const RET_VAL = {
        conversationId: this.conversationId,
        conversationIdExternal: this.conversationIdExternal,
      };
      return RET_VAL
    } catch (error) {
      const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
      logger.error(this.startChat.name, { ACA_ERROR });
      throw ACA_ERROR;
    }
  }

  async subscribeForTeliaAceEvents() {
    try {
      if (
        lodash.isEmpty(this.conversationId)
      ) {
        const ERROR_MESSAGE = `Missing required this.conversationId attribute!`;
        throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, ERROR_MESSAGE);
      }
      if (
        !this.unsubscribeFromTeliaAceEvents
      ) {
        const MAIN_EVENT_STREAM = getEventStreamMain();
        const EVENT_TYPE = `teliaace:${this.conversationId}`;
        this.unsubscribeFromTeliaAceEvents = await MAIN_EVENT_STREAM.subscribe(
          EVENT_TYPE,
          async (
            event: any,
            eventChannel: any,
          ) => {
            try {
              logger.info(MODULE_ID,
                {
                  event,
                  eventChannel,
                });

              await processMessage(this, event?.body);
            } catch (error) {
              const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
              appendDataToError(ACA_ERROR,
                {
                  eventChannel,
                  event,
                });
              logger.error(this.subscribeForTeliaAceEvents.name, { ACA_ERROR });
            }
          }
        );
      }
    } catch (error) {
      const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
      logger.error(this.subscribeForTeliaAceEvents.name, { ACA_ERROR });
      throw ACA_ERROR;
    }
  }

  async continueChat(session: IChatServerSessionV1) {
    try {
      if (
        lodash.isEmpty(session?.conversation?.id)
      ) {
        const ERROR_MESSAGE = 'Missing required session?.conversation parameter!';
        throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, ERROR_MESSAGE);
      }
      if (
        lodash.isEmpty(session?.conversation?.external?.id)
      ) {
        const ERROR_MESSAGE = 'Missing required session?.conversation parameter!';
        throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, ERROR_MESSAGE);
      }
      this.conversationId = session?.conversation?.id;
      this.conversationIdExternal = session?.conversation?.external?.id;
      await this.subscribeForTeliaAceEvents();

      const RET_VAL = {
        conversationId: this.conversationId,
        conversationIdExternal: this.conversationIdExternal,
      };
      return RET_VAL
    } catch (error) {
      const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
      throw ACA_ERROR;
    }
  }

  async sendMessage(message: IChatMessageV1) {
    if (
      lodash.isEmpty(message?.message?.text)
    ) {
      logger.info(this.sendMessage.name, `Can't sent empty message.` );
      return;
    }

    try {
      await channelClient.sendMessage(
        this,
        {
          state: this.__session().channel[this.id],
          message: message,
        },
      );

    } catch (error) {
      const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
      logger.error(this.sendMessage.name, { ACA_ERROR });
    }
  }

  async disconnect(userClose = undefined) {
    logger.info('disconnect');
    try {
      this.online = false;

      await channelClient.disconnect(
        this,
        {
          state: this.__session().channel[this.id]
        },
      );

      this.chatServerSessionProvider = undefined;
    } catch (error) {
      const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
      appendDataToError(ACA_ERROR, { userClose });
      logger.error(this.disconnect.name, { ACA_ERROR });
    }
  }

  async handleClientSideDisconnect() {
    this.online = false;
    logger.info('handleClientSideDisconnect | refreshTime removed!');
  }

  async sendUserTyping(status) {
    try {
      logger.info(MODULE_ID, this.sendUserTyping.name, { 
        status 
      });

      switch (status) {
        case true:
          await channelClient.sendUserTyping(
            this,
            {
              state: this.__session().channel[this.id],
              status: 'on'
            },
          );
          break;
        case false:
          await channelClient.sendUserTyping(
            this,
            {
              state: this.__session().channel[this.id],
              status: 'off'
            },
          );
          break;
      }
    } catch (error) {
      const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
      logger.error(this.sendUserTyping.name, { ACA_ERROR });
    }
  }

  async sendTranscript(
    session: IChatServerSessionV1,
  ) {
    try {
      const TRANSCRIPT = await retrieveTranscript(session);
      const BATCH = await transformTranscript(TRANSCRIPT);
    
      for (const MESSAGE of BATCH) {
        logger.info(MODULE_ID, this.sendTranscript.name, { 
          MESSAGE: JSON.stringify(MESSAGE) 
        });
        await this.sendMessage(MESSAGE);
      }
      
    } catch (error) {
      const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
      logger.error(this.sendTranscript.name, { ACA_ERROR });
      throw ACA_ERROR;
    }
  }
}

export {
  ChatChannelV1TeliaAce,
}
