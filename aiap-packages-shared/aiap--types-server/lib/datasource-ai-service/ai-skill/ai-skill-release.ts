/*
  © Copyright IBM Corporation 2023. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import {
  IAiSkillV1,
} from './ai-skill';

export interface IAiSkillReleaseV1 {
  id?: any,
  versions?: {
    deployed?: IAiSkillV1,
  },
  deployedT?: any,
  deployed: {
    date: Date,
    user: {
      id: any,
      name: any,
    }
  }
}
