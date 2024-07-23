/*
  © Copyright IBM Corporation 2023. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
export interface ISoeTraceIdV1 {
  agentId: string,
  conversationId: string,
  dialogId: string,
  soeSocketIdServer: string,
  utteranceId: string,
  messageId: string,
  botMessageId: string,
}
