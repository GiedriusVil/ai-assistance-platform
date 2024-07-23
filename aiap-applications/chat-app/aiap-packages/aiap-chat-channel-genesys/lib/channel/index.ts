/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-chat-channel-genesys-genesys-service';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const WebSocket = require('ws');

import {
  IChatMessageV1,
  IChatServerSessionV1,
  ChatChannelV1,
} from '@ibm-aiap/aiap-chat-app--types';



import { formatIntoAcaError } from '@ibm-aca/aca-utils-errors';

import { GenesysService } from '../service';


import {
  IChatChannelV1GenesysConfiguration,
} from '../types';

class ChatChannelV1Genesys extends ChatChannelV1<IChatChannelV1GenesysConfiguration> {

  genesysService: any;
  latestTimestamp: any;

  ws: any;

  constructor(
    id,
    chatServerSessionProvider,
    configuration
  ) {
    super(id, chatServerSessionProvider, configuration);
    this.genesysService = new GenesysService(configuration);
    this.latestTimestamp = null;
    this.type = 'GENESYS_V1';
  }

  async startChat(session: IChatServerSessionV1, notify?: boolean): Promise<{ conversationId: string; conversationIdExternal: string; }> {
    try {
      const TOKEN = 'FIX_ME';
      const session = await this.genesysService.startChat(TOKEN, this.chatServerSessionProvider);
      logger.info('[INFO] Genesys Session started.', session);
      this.conversationId = session['id'];
      this.ws = new WebSocket(session.eventStreamUri);
      this.setChatListeners();
      this.ws.connect();
      const RET_VAL = {
        conversationId: this.conversationId,
        conversationIdExternal: this.conversationIdExternal,
      }
      return RET_VAL;
    } catch (error) {
      logger.error(`[ERROR] Failed to start the Genesys Chat`, error);
    }
  }
  continueChat(session: IChatServerSessionV1): Promise<{ conversationId: string; conversationIdExternal: string; }> {
    throw new Error('Method not implemented.');
  }
  async sendMessage(message: IChatMessageV1): Promise<any> {
    try {
      const MESSAGE_MESSAGE_TEXT = message?.message?.text;
      if (
        MESSAGE_MESSAGE_TEXT
      ) {
        await this.genesysService.postMessage(MESSAGE_MESSAGE_TEXT);
      }
    } catch (error) {
      const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
      logger.error(this.sendMessage.name, { ACA_ERROR });
      throw ACA_ERROR
    }
  }
  async disconnect(): Promise<any> {
    this.chatServerSessionProvider.disconnect();
    this.ws.close();

    const RET_VAL = this.genesysService.endChat(true);
    return RET_VAL;
  }

  handleClientSideDisconnect(): Promise<any> {
    throw new Error('Method not implemented.');
  }
  sendUserTyping(status: any): Promise<any> {
    throw new Error('Method not implemented.');
  }

  setChatListeners() {
    this.ws.on('open', function open() {
      logger.info(`[INFO] initiated web socket connection`);
    });

    this.ws.on('message', async (event) => {
      logger.info(`[DEBUG] received new message event ${event}`);
      const eventData = JSON.parse(event);
      if (
        eventData.eventBody &&
        eventData.metadata
      ) {
        // Checking event type
        switch (eventData.metadata.type) {
          case 'message': {
            // Cheking message event bodyType
            switch (eventData.eventBody.bodyType) {
              case 'standard': {
                logger.info(`[DEBUG] standard message event`);
                // Checking who is the author of the message
                if (this.genesysService.getSession().member.id != eventData.eventBody.sender.id) {
                  logger.info('[INFO] new agent message received from Genesys', {
                    appSocketId: this.chatServerSessionProvider.clientId,
                  });
                  this.chatServerSessionProvider.send({
                    message: {
                      text: eventData.eventBody.body,
                    },
                  });
                }
                break;
              }
              case 'member-join': {
                logger.info(`[DEBUG] member-join event`);
                const memberData = await this.genesysService.getMemberDetails(eventData);
                if (
                  memberData
                ) {
                  logger.debug(`[DEBUG] creating member join event`);
                  this.chatServerSessionProvider.send({
                    sender_action: {
                      type: 'notification',
                      text: `You are now connected with  ${memberData.displayName}`,
                    },
                    conversationId: this.conversationId,
                  });
                  this.genesysService
                    .postMessage(`User wants to talk with the agent`)
                    .then(() => {
                      //
                    })
                    .catch(error => {
                      logger.error(error);
                    });
                }
                break;
              }
              case 'member-leave': {
                logger.info(
                  `[INFO] member-leave event user ${this.genesysService.getSession().member.id} agent ${eventData.eventBody.sender.id}`
                );
                //TODO investigate further the leave event,
                // for some reason, triggered multiple times while agent is joining the chat
                // with different sender.id's
                // if (this.genesysService.getSession().member.id != eventData.eventBody.sender.id) {
                //     logger.info(`[INFO] agent left the chat`);
                //     this.appSocket.send({
                //       sender_action: {
                //         type: 'notification',
                //         text: `Agent left conversation`,
                //       },
                //       conversationId: this.conversationId,
                //     });
                // }
                break;
              }
            }
            break;
          }
          case 'member-change': {
            logger.info(`[INFO] member-change event user ${this.genesysService.getSession().member.id} agent ${eventData.eventBody.member.id} state ${eventData.eventBody.member.state}`);
            if (
              this.genesysService.getSession().member.id == eventData.eventBody.member.id &&
              eventData.eventBody.member.state == 'DISCONNECTED'
            ) {
              logger.info(`[INFO] agent left the chat and user was disconnected, closing the chat session`);
              this.chatServerSessionProvider.send({
                sender_action: {
                  type: 'notification',
                  text: `Agent left conversation`,
                },
                conversationId: this.conversationId,
              });
              this.disconnect();
            }
            break;
          }
          case 'typing-indicator': {
            logger.info(`[INFO] typing indicator event received ${event}`);
            if (this.genesysService.getSession().member.id != eventData.eventBody.sender.id) {
              logger.info(`[INFO] Agent typing`);
            }
            break;
          }
        }
      }
    });
  }

  setChatServerSessionProvider(chatServerSessionProvider: any) {
    this.chatServerSessionProvider = chatServerSessionProvider;
  }

}

export {
  ChatChannelV1Genesys,
};
