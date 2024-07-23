/*
  © Copyright IBM Corporation 2023. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
interface IMessageShadowV1 {
  id: string,
  conversationId: string,
  utteranceId: string,
  created: Date,
  action?: IAction,
  author: string,
  message: string,
}

interface IAction {
  type: string,
  data: {
    utteranceId: string,
  },
}

export {
  IMessageShadowV1,
}
