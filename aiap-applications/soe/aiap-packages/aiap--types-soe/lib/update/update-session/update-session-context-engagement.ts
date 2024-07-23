/*
  © Copyright IBM Corporation 2023. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
export interface ISoeUpdateSessionContextEngagementV1 {
  soe?: {
    aiService?: {
      id: string,
      aiSkill?: {
        id: string,
      }
    }
  },
  [key: string | number | symbol]: any,
}
