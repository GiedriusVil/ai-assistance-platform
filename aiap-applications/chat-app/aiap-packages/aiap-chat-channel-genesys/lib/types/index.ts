/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import {
    IChatChannelV1Configuration,
  } from '@ibm-aiap/aiap-chat-app--types';
  
  interface IChatChannelV1GenesysConfiguration extends IChatChannelV1Configuration {
  
    external: {
      version: string,
      skill: string,
      environment: string,
      service: string,
      url: string,
      onDisconnectAction: string,
      pollingInterval: number,
    }
  
  }
  
  export {
    IChatChannelV1GenesysConfiguration,
  }
  