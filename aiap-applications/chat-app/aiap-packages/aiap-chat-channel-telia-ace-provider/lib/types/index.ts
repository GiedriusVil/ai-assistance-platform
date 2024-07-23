/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import {
  IChatChannelV1Configuration,
} from '@ibm-aiap/aiap-chat-app--types';

type VideoChatCapabilities = 'enabled' | 'disabled' | 'requested';

type ContactData = {
  customerName?: string,
  cid?: string,
  customerSpecific5?: string,
}

interface IChatChannelV1TeliaAceConfiguration extends IChatChannelV1Configuration {

  external: {
    authentication: {
      username: string,
      password: string,
      endpoint: string,
    },
    conversation: {
      endpoint: string,
      chatSettings: {
        eventCallbackURL: string,
        eventCallbackBearerToken: string,
        chatEngineInstanceName: string,
        customerIpAddress: string,
        sourceUrl: string,
        entrance: string,
        errand: string,
        videoChatCapabilities: VideoChatCapabilities
      },
      onDisconnectAction: string,
    },
  }

}

interface IChatMessageV1TeliaAceV1 {
  id: number,
  properties: {
    alias: string,
    customerId: 0,
    message: string,
    source: string,
    timeStamp: string,
    estimatedQueueTime: number,
    infoText: string,
    position: number
  },
  type: string,
}

type PostConversationBody = {
  eventCallbackURL: string,
  eventCallbackBearerToken: string,
  chatEngineInstanceName: string,
  customerIpAddress: string,
  sourceUrl: string,
  entrance: string,
  errand: string,
  videoChatCapabilities: VideoChatCapabilities,
  authenticationToken?: string,
  queueMessageInterval?: string,
  contactData?: ContactData,
}

export {
  IChatChannelV1TeliaAceConfiguration,
  IChatMessageV1TeliaAceV1,
  PostConversationBody,
}
