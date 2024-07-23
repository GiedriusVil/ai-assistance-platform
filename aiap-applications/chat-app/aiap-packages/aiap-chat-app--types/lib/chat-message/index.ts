/*
  © Copyright IBM Corporation 2023. All Rights Reserved

  SPDX-License-Identifier: EPL-2.0
*/

interface IChatMessageV1 {
  id: string,
  type: string,
  recipient?: {
    id?: string,
  },
  message?: {
    timestamp?: number,
    text?: string,
    audio?: any,
    sender_action?: {
      type: string,
      subType?: string,
      channelId?: string,
      skill?: string,
      data?: {
        utteranceId?: string
      }
    },
    attachment?: {
      type: string,
      data: any,
      attributes?: any,
      attachments?: any,
    },
    audioMuted?: boolean
  },
  sender_action?: {
    type: string,
    subType?: string,
    channelId?: string,
    skill?: string,
    message?: string,
    apikey?: string,
  },
  session?: any,
  engagement?: {
    id: string,
    chatAppServer: any,
  },
  confirmations?: { piAgreement: null },
  clientSideInfo?: {
    hostname: string,
    size: string,
    language: string,
    name: string,
    version: string,
    os: string,
    type: string,
  }
  traceId?: {
    agentId: string,
    soeSocketIdServer: 'WKebu1hgeP12gj21AABZ',
    dialogId: string,
    conversationId: string,
    utteranceId: string,
    messageId: string,
  },
  gAcaProps?: {
    tenantId?: string,
    tenantHash?: string,
    assistantId?: string,
    engagementId?: string,
    accessToken?: string,
    user?: any,
    userProfile?: any,
    userSelectedLanguage?: any,
    lang?: string,
    isoLang?: string,
    href?: string,
  },
  conversationId?: string
}

enum MESSAGE_TYPE {
  ACA_ERROR = 'ACA_ERROR',
  ACA_DEBUG = 'ACA_DEBUG',
}

export {
  IChatMessageV1,
  MESSAGE_TYPE,
}
