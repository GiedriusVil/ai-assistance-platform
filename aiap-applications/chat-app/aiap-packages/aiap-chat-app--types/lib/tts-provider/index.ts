/*
  © Copyright IBM Corporation 2023. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
interface ITTSServiceV1 {
  configurations: {
    serviceUrl: string,
    apiKey: string,
    voicesByLanguage?: {
      [key: string]: string
    }
  },
  created: {
    user: {
      id: string,
      name: string
    },
    date:string
  },
  update: {
    user: {
      id: string,
      name: string
    },
    date:string
  },
  id: string,
  name: string,
  refId: string,
  type: string,

}

export {
  ITTSServiceV1,
}
