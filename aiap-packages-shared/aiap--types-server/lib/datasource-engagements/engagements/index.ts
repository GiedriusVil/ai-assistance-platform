/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import {
  IEngagementChatAppV1
} from '../engagement-chat-app';

import {
  IEngagementChatAppButtonV1
} from '../engagement-chat-app-button';

import {
  IEngagementChatAppServerV1
} from '../engagement-chat-app-server';

import {
  IEngagementSoeV1
} from '../engagement-soe';

export interface IEngagementV1 {
  id?: string,
  name?: string,
  assistant?: {
    id: string
  },
  styles?: {
    value: string,
  },
  assistantDisplayName?: string,
  chatApp?: IEngagementChatAppV1,
  chatAppButton?: IEngagementChatAppButtonV1,
  chatAppServer?: IEngagementChatAppServerV1,
  soe?: IEngagementSoeV1,
  slack?: any,
  created?: {
    user: {
      id: string,
      name: string,
    },
    date: string,
  },
  updated?: {
    user: {
      id: string,
      name: string,
    },
    date: string,
  },
}
