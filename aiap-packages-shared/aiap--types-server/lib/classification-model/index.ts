/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
export interface IClassificationModelV1 {
  ware: {
    disambiguation: {
      threshold: number,
      aiSkillId: string,
    },
    threshold: {
      classifier: {
        top: number,
        range: number,
        min: number,
        quantity: number,
      },
      aiService: {
        top: number,
        range: number,
        min: number,
      },
      intent: {
        top: number,
        range: number,
        min: number,
        quantity: number,
      }
    }
  }
}

