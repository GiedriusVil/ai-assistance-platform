/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { disconnect } from './disconnect';
import { refreshChat } from './refresh-chat';
import { requestChat } from './request-chat';
import { sendMessage } from './send-message';
import { startTyping } from './start-typing';
import { stopTyping } from './stop-typing';

const channelClient = {
  disconnect,
  refreshChat,
  requestChat,
  sendMessage,
  startTyping,
  stopTyping,
}

export {
  channelClient,
}
