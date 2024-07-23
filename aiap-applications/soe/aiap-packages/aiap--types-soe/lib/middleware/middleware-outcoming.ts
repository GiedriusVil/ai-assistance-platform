/*
  © Copyright IBM Corporation 2023. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import {
  ISoeShouldSkipContextV1,
} from '../should-skip-context';

export interface ISoeMiddlewareOutgoingV1 {
  type: 'outgoing',
  name: string,
  // eslint-disable-next-line @typescript-eslint/ban-types
  controller: Function,
  shouldSkip: (context: ISoeShouldSkipContextV1) => boolean,
  includeEcho: any,
  includeDelivery: any,
  includeRead: any
}
