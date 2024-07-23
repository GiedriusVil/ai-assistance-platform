/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import {
  IChatChannelV1Configuration,
} from '@ibm-aiap/aiap-chat-app--types';

import {
  ChatChannelV1Rocketchat
} from '../channel'

interface IChatChannelV1RocketchatConfiguration extends IChatChannelV1Configuration {

  external: {
    host: string,
    port: string,
    path: string
  }

}

interface IChatChannelV1RocketchatProcessMessageParams {
  channel: ChatChannelV1Rocketchat,
  message: any
}

export {
  IChatChannelV1RocketchatConfiguration,
  IChatChannelV1RocketchatProcessMessageParams
}
