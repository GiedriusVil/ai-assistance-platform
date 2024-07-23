/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import {
  IChatChannelV1Configuration,
} from '@ibm-aiap/aiap-chat-app--types';

interface IChatChannelV1SocketioConfiguration extends IChatChannelV1Configuration {

  external: {
    url: string,
    path: string,
    transports: any,
    reconnectionAttempts: number,
  };

}

export {
  IChatChannelV1SocketioConfiguration,
}
