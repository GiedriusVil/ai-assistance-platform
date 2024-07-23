/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/

export interface IAssistantSkill {
  name: string,
  type: string,
  status: string,
  language: string,
  skill_id: string,
  workspace: {
    actions?: Array<any>,
    intents: Array<any>,
    entities: Array<any>,
    metadada: any,
    variables?: Array<any>,
    dialog_nodes?: Array<any>,
    data_types?: Array<any>,
    collections?: Array<any>,
    counterexamples: Array<any>,
    system_settings?: any,
    learning_opt_out: boolean,

  },
  description: string,
  dialog_settings: any
}

export interface IRetrieveSkillParamsV1 {
  aiService: {
    id: string,
    name: string,
    aiSkill: {
      id: string,
      name: string,
      externalId?: string
    }
  }
}
export interface IRetrieveSkillsResponseV1 {
  actionSkill: any,
  dialogSkill: any
}

export interface IFormatIntentsParamsV1 {
  intents: Array<any>,
  skill: IAssistantSkill
}

export interface IFormatIntentsResponseV1 {
  name: string,
  type: string,
  status: string,
  language: string,
  skill_id: string,
  workspace: {
    actions?: Array<any>,
    intents: Array<any>,
    entities: Array<any>,
    metadada: any,
    variables?: Array<any>,
    dialog_nodes?: Array<any>,
    data_types?: Array<any>,
    collections?: Array<any>,
    counterexamples: Array<any>,
    system_settings?: any,
    learning_opt_out: boolean,

  },
  description: string,
  dialog_settings: any
}

export interface IImportSkillsParamsV1 {
  assistantSkills: Array<IAssistantSkill>,
  assistantState: {
    action_disabled: boolean,
    dialog_disabled: boolean
  }
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IImportSkillsResponseV1 {

}
