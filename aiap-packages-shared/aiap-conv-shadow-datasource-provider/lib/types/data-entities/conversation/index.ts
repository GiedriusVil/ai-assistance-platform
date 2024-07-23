/*
  © Copyright IBM Corporation 2023. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
interface IConversationShadowV1 {
  id: string,
  userId: string,
  start: Date,
  end: Date,
  day: number,
  month: number,
  year: number,
  channelMeta?: {
    type: string
  },
  hasUserInteraction?: boolean,
  duration?: number
}

export {
  IConversationShadowV1,
}
