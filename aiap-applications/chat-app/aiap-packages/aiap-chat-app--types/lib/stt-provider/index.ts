/*
  © Copyright IBM Corporation 2023. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
interface ISTTServiceV1 {
  configurations: {
    serviceUrl: string,
    apiKey: string,
    modelsByLanguage?: {
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
  ISTTServiceV1,
}
