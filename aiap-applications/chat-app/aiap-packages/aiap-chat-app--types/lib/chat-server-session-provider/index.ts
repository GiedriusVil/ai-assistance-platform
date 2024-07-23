/*
  © Copyright IBM Corporation 2023. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-chat-app--types-chat-server-v1-session-provider';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import lodash from '@ibm-aca/aca-wrapper-lodash';

import {
  uuidv4,
} from '@ibm-aca/aca-wrapper-uuid';

import {
  formatIntoAcaError,
  throwAcaError,
  ACA_ERROR_TYPE,
} from '@ibm-aca/aca-utils-errors';

import { ChatChannelV1 } from '../chat-channel';
import { IChatChannelV1Configuration } from '../chat-channel-configuration';
import { IChatMessageV1 } from '../chat-message';
import { ChatServerV1 } from '../chat-server';
import { IChatServerSessionV1 } from '../chat-server-session';

import {
  getEventStreamChatApp,
} from '@ibm-aiap/aiap-event-stream-provider';

abstract class ChatServerV1SessionProvider
  <
    EChatServerV1 extends ChatServerV1,
    EChatChannelV1 extends ChatChannelV1<IChatChannelV1Configuration>,
  >
{

  server: EChatServerV1;
  socket: any;

  channel: EChatChannelV1;

  eventEmitterSTT: any;
  eventEmitterTTS: any;

  session: IChatServerSessionV1;

  constructor(
    server: EChatServerV1,
    socket: any,
  ) {
    this.server = server;
    this.socket = socket;
  }

  abstract init(): Promise<any>;

  async subscribe2EventStreamChatApp() {
    try {
      const EVENT_STREAM = getEventStreamChatApp();
      if (
        !EVENT_STREAM
      ) {
        const ERROR_MESSAGE = `Unable to retrieve EventStreamChatApp!`;
        throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, ERROR_MESSAGE);
      }
      const CONVERSATION_ID = this.session?.conversation?.id;
      const CALLBACK = async (
        data: any,
        channel: any,
      ) => {
        try {
          const EVENT = data?.event;
          const EVENT_CODE = data?.event?.code;

          switch (EVENT_CODE) {
            case 'SESSION_EXPIRATION_NOTIFICATION':
              await this.processSessionExpirationNotification(EVENT);
              break;
            default:
              break;
          }
        } catch (error) {
          const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
          logger.error(this.subscribe2EventStreamChatApp.name, { ACA_ERROR });
        }
      }
      EVENT_STREAM.subscribe(
        CONVERSATION_ID,
        CALLBACK,
      )

    } catch (error) {
      const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
      logger.error(this.subscribe2EventStreamChatApp.name, { ACA_ERROR });
      throw ACA_ERROR;
    }
  }

  async processSessionExpirationNotification(event: any) {
    try {
      const TIME_TO_LIVE = event?.timeToLive;
      const MINUTES = parseInt((TIME_TO_LIVE / 60).toString());
      const REST_SECONDS = TIME_TO_LIVE - MINUTES * 60;
      const NICE_TIME = `${MINUTES}m ${REST_SECONDS}s`;
      const NOTIFICATION_MESSAGE = {
        id: uuidv4(),
        type: 'notification',
        message: {
          timestamp: Date.now(),
          text: 'chat_app_session_expiration_notification',
        },
        translationKey: 'chat_app_session_expiration_notification',
        translationParams: {
          niceTime: NICE_TIME,
        }
      };

      await this.sendOutgoingMessage(NOTIFICATION_MESSAGE);

    } catch (error) {
      const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
      logger.error(this.processSessionExpirationNotification.name, { ACA_ERROR });
      throw ACA_ERROR;
    }
  }

  abstract handleEventDisconnect(): Promise<any>;

  abstract handleEventIncomingMessage(message: IChatMessageV1): Promise<any>;

  abstract handleEventTransferToBot(message: IChatMessageV1): Promise<any>;

  abstract handleEventTransfer(message: IChatMessageV1): Promise<any>;

  abstract sendOutgoingMessageAcaDebug(moduleId: string, data: any): Promise<any>;

  abstract sendOutgoingMessageAcaError(moduleId: string, error: any): Promise<any>;

  abstract sendOutgoingMessage(message: IChatMessageV1): Promise<any>;

  __assignDefaultChatChannelId() {
    let defaultChannelId;
    try {
      if (
        lodash.isEmpty(this.session?.engagement?.chatAppServer?.channel2Connect)
      ) {
        const ERROR_MESSAGE = `Missing required this.session?.engagement?.chatAppServer?.channel2Connect attribute!`;
        throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, ERROR_MESSAGE);
      }
      defaultChannelId = this.session?.engagement?.chatAppServer?.channel2Connect;
      this.session.channel = {
        id: defaultChannelId,
      }
    } catch (error) {
      const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
      logger.error(this.__assignDefaultChatChannelId.name, { ACA_ERROR });
      throw ACA_ERROR;
    }
  }

}

export {
  ChatServerV1SessionProvider,
}
