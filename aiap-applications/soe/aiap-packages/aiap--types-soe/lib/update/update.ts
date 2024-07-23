/*
  © Copyright IBM Corporation 2023. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import {
  IAiServiceRequestV1,
  IAiServiceResponseV1,
} from '@ibm-aiap/aiap--types-server';

import {
  ISoeChannelV1,
} from '../channel';

import {
  ISoeRawV1,
} from '../raw';

import {
  ISoeRecipientV1,
} from '../recipient';

import {
  ISoeSenderV1,
} from '../sender';

import {
  ISoeUpdateContextV1,
} from './update-context';

import {
  ISoeUpdateMetaV1,
} from './update-meta';

import {
  ISoeUpdateSessionV1,
} from './update-session/update-session';

import {
  ISoeTraceIdV1,
} from './update-trace-id';

export interface ISoeUpdateV1 {
  timestamp: number,
  status: string,
  traceId?: ISoeTraceIdV1,
  channel: ISoeChannelV1,
  sender: ISoeSenderV1,
  transfer: any,
  recipient: ISoeRecipientV1,
  session: ISoeUpdateSessionV1,
  private: any,
  conversation: {
    [key: string | number | symbol]: any,
  },
  request?: {
    message?: {
      text?: string,
    }
  },
  response: {
    [key: string | number | symbol]: any,
  },
  raw: ISoeRawV1,
  message?: any,
  delivery?: any,
  read?: any,
  // DEPRECATED. check __shouldSkip and remove
  aiServiceRequest: IAiServiceRequestV1,
  aiServiceResponse: IAiServiceResponseV1,
  meta: ISoeUpdateMetaV1
  context: ISoeUpdateContextV1,
  metricsTracker: any,
  //
  skipConversationLogger: any,
  skipLogging: any,
  source: any,
  metadata?: any,
  getTraceId: () => ISoeTraceIdV1;
}
