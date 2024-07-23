/*
  © Copyright IBM Corporation 2023. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import {
  ISoeUpdateSessionContextEngagementV1,
} from './update-session-context-engagement';

export interface ISoeUpdateSessionContextV1 {
  engagement?: ISoeUpdateSessionContextEngagementV1,
  [key: string | number | symbol]: any,
}
