/*
  © Copyright IBM Corporation 2023. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import {
  IAiServiceV1,
  IAiServiceRequestV1,
  IAiServiceResponseV1,
} from '@ibm-aiap/aiap--types-server';

import {
  ISoeConversationV1,
} from '../../conversation';

import {
  ISoeUpdateSessionAuthV1,
} from './update-session-auth';

import {
  ISoeUpdateSessionContextV1,
} from './update-session-context';

import {
  ISoeUpdateSessionLastContextV1,
} from './update-session-last-context';

import {
  ISoeUpdateSessionLastStateV1,
} from './update-session-last-state';

import {
  ISoeUpdateSessionStateV1,
} from './update-session-state';

import {
  ISoeUpdateSessionMetadataV1
} from './update-session-metadata';

import {
  ISoeUpdateSessionProfileV1
} from './update-session-profile'

import {
  ISoeUpdateSessionPendingReplyV1
} from './update-session-pending-reply'

export interface ISoeUpdateSessionV1 {
  aca?: {
    aiServiceChangeLoopHandlerCounter: number,
  },
  dialogId?: string,
  dialogType?: string,
  buttonPayloads?: any,
  transfer?: any,
  conversation?: ISoeConversationV1,
  auth?: ISoeUpdateSessionAuthV1,
  aiService?: IAiServiceV1,
  aiServiceRequest?: IAiServiceRequestV1,
  aiServiceResponse?: IAiServiceResponseV1,
  state?: ISoeUpdateSessionStateV1,
  context?: ISoeUpdateSessionContextV1,
  lastState?: ISoeUpdateSessionLastStateV1,
  lastContext?: ISoeUpdateSessionLastContextV1,
  external?: {
    [key: string | number | symbol]: any,
  },
  metadata?: ISoeUpdateSessionMetadataV1,
  profile?: ISoeUpdateSessionProfileV1,
  pendingReply?: ISoeUpdateSessionPendingReplyV1
}
