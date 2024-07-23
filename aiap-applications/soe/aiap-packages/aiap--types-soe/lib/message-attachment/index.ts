/*
  © Copyright IBM Corporation 2023. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
export interface ISoeMessageAttachmentV1 {
  type: string,
  payload?: any,
  isWbc?: boolean,
  path?: string,
  host?: string,
}
