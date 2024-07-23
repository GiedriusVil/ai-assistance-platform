/*
  © Copyright IBM Corporation 2023. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
interface IChatServerSessionV1 {
  conversation: {
    id: string,
    external: {
      id: string,
    }
  },
  channel: {
    id: string,
    [key: string]: any,
  },
  token?: {
    value?: any,
  }
  room?: {
    id?: any,
  },
  actions?: any,
  isAudioMuted?: boolean,
  engagement: any,
  gAcaProps: any,
}

export {
  IChatServerSessionV1,
}
