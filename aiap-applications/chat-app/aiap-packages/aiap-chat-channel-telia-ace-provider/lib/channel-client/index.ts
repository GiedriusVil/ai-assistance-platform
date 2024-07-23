/*
   © Copyright IBM Corporation 2022. All Rights Reserved 
    
   SPDX-License-Identifier: EPL-2.0
*/
import { authenticate } from './authenticate';
import { disconnect } from './disconnect';
import { postConversation } from './post-conversation';
import { sendMessage } from './send-message';
import { sendUserTyping } from './send-user-typing';

const channelClient = {
  disconnect,
  authenticate,
  postConversation,
  sendMessage,
  sendUserTyping,
};

export { channelClient };
