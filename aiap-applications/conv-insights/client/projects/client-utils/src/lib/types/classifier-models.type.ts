/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/

export interface AiServicesSkillsItems {
  items: [
    content: string,
    selected: boolean,
    value: {
      serviceId: string,
      skillId: string,
      skillExternalId: string
    }
  ]
}
