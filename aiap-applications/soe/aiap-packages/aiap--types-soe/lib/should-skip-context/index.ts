/*
  © Copyright IBM Corporation 2023. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import {
  ISoeUpdateV1,
} from '../update';

import {
  ISoeMiddlewareIncomingV1,
} from '../middleware';

import {
  ISoeMiddlewareOutgoingV1,
} from '../middleware/middleware-outcoming';

export interface ISoeShouldSkipContextV1 {
  bot: any,
  update: ISoeUpdateV1,
  message: any,
  middlewareStack: ISoeMiddlewareIncomingV1[] | ISoeMiddlewareOutgoingV1[],
}
